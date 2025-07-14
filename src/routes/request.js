const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const {run} = require("../utils/sendEmail");

const USER_SAFE_DATA = ["firstName", "lastName"];

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const senderId = req.user._id;
      const receiverId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status type: " + status);
      }

      const isConnectionRequestExist = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });

      if (isConnectionRequestExist) {
        throw new Error("Connection request already exist");
      }

      const sender = await User.findById(receiverId);

      if (!sender) {
        return res.status(404).send("User not found");
      }

      const newConnectionRequest = await ConnectionRequest({
        senderId,
        receiverId,
        status,
      });
      
      const data = await newConnectionRequest.save();

      const newRequest = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      }).populate("receiverId", USER_SAFE_DATA);
      const bodyContent = `You ${status} ${
        status === "interested" ? "in" : ""
      } ${
        newRequest.receiverId.firstName + " " + newRequest.receiverId.lastName
      }`;

      const sentEmail = await run(bodyContent);
      console.log(sentEmail)

      res.json({
        message: `${
          status === "ignored"
            ? "You ignored a new connection"
            : "You interested in a new connection"
        } `,
        data,
      });
    } catch (error) {
      res.status(400).send("Error :" + error);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res, next) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Status not allowed");
      }

      const connectionRequests = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequests) {
        throw new Error("Connection request not found");
      }

      connectionRequests.status = status;
      await connectionRequests.save();
      res.status(200).json({
        message: "Successfully sent the request " + status,
      });
    } catch (error) {
      res.status(400).send("Error :" + error);
    }
  }
);

module.exports = requestRouter;
