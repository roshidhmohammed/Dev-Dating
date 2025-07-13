const express = require("express");
const { signUpValidation, loginValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "emailId",
  "profilePic",
  "skills",
  "createdAt",
  "updatedAt",
  "password",
];

authRouter.post("/sign-up", async (req, res) => {
  try {
    signUpValidation(req);
    const { password, firstName, lastName, emailId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const isEmailExist = await User.findOne({ emailId: emailId });
    if (isEmailExist) {
      throw new Error("Email Id already exist");
    }
    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });

    res
      .status(201)
      .json({ message: "User Created Successfully", data: savedUser });
  } catch (error) {
    res.status(400).send(`Error : ${error.message}`);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    loginValidation(req);
    const user = await User.findOne({ emailId }).select(USER_SAFE_DATA);
    if (!user) {
      throw new Error("Invalid Login Details");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid Login Details");
    } else {
      const safeUser = user.toObject();
      delete safeUser.password;
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });
      res.status(200).json({
        message: "Login Successfull!",
        data: safeUser,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", async (req, res, next) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(),
      })
      .send("Logout Successful!!!");
  } catch (error) {
    res.status(400).send("Error :" + error);
  }
});

module.exports = authRouter;
