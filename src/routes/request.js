const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router()


requestRouter.post("/send-connection-request", userAuth, async (req, res, next) => {
  try {
    const user = req.user;
    res.send(user.firstName + " sent connection request");
  } catch (error) {
    res.status(400).send("Error :" + error);
  }
});

module.exports = requestRouter