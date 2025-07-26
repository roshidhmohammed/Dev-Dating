const express = require("express");
const Chat = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const senderId = req.user?._id;
  try {

    let chat = await Chat.findOne({
      participants: { $all: [senderId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName profilePic",
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.status(200).json({
      chat,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = chatRouter;
