const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "skills", "profilePic", "age", "gender", "about"];

userRouter.get("/user/connection/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      receiverId: loggedInUser._id,
      status: "interested",
    }).populate("senderId", USER_SAFE_DATA);

    if (!connectionRequest) {
      throw new Error("No received connection found");
    }

    res.status(200).json({
      message: "Fetched all the received connection",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { senderId: loggedInUser._id, status: "accepted" },
        { receiverId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("senderId", USER_SAFE_DATA)
      .populate("receiverId", USER_SAFE_DATA);

    const data = connections?.map((connection) => {
      if (connection.senderId._id.toString() === loggedInUser._id.toString()) {
        return connection.receiverId;
      }
      return connection.senderId;
    });

    res.status(200).send({
      message: "Successfully fetched all the connections",
      data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res, next) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ senderId: loggedInUser._id }, { receiverId: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.senderId.toString());
      hideUsersFromFeed.add(request.receiverId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
