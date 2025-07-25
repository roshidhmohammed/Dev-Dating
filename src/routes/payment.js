const express = require("express");
const { userAuth } = require("../middlewares/auth");
const instance = require("../utils/razorpay");
const membershipAmount = require("../utils/constants");
const paymentRouter = express.Router();
const Payment = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    const createOrder = await instance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: createOrder.id,
      amount: createOrder.amount,
      currency: createOrder.currency,
      receipt: createOrder.receipt,
      status: createOrder.status,
      notes: createOrder.notes,
    });

    const savedPayment = await payment.save();
    res.status(201).json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({
        msg: "Payment status is not accessible",
      });
    }

    const paymentDetails = req.body.payload.payment.entity;


    const updatePayment = await Payment.findOne({
      orderId: paymentDetails.order_id,
    });
    updatePayment.status = paymentDetails.status;
    await updatePayment.save();

    const updateUser = await User.findOne({ _id: updatePayment.userId });
    updateUser.isPremium = true;
    updateUser.membershipType = paymentDetails.notes.membershipType;

    await updateUser.save();

    //  if(req.body.event === "payment.captured") {

    //  }

    //  if(req.body.event === "payment.failed") {

    //  }

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

paymentRouter.get("/payment/verify", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
    // }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = paymentRouter;
