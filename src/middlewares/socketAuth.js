// socketAuth.js
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const socketAuth = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("No cookie provided"));
    }

    const parsed = cookie.parse(cookieHeader);
    const token = parsed.token;
    if (!token) {
      return next(new Error("Token not found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);
    console.log(user.firstName);
    if (!user) {
      return next(new Error("User not found"));
    }
    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Authentication failed"));
  }
};

module.exports = socketAuth;
