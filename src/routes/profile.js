const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, forgotPasswordValidation } = require("../utils/validation");
const bcrypt = require("bcrypt")
const User = require("../models/user")

const profileRouter = express.Router();

profileRouter.use("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user)
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error :" + error)
  }
});

profileRouter.patch("/profle/edit", userAuth, async (req, res, next) => {
  try {
    const isEditAllowed = validateEditProfileData(req);
    if (!isEditAllowed) {
      throw new Error("Editing profile is not allowed");
    } else {
      const loggedInUser = req.user;
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );
      await loggedInUser.save();
      res.send({
        message: `${loggedInUser.firstName}, your profile updated successfully`,
        loggedInUser,
      });
    }
  } catch (error) {
    res.status(400).send("ERROR: " + error);
  }
});

profileRouter.patch("/profile/forgot/password", userAuth, async(req, res) =>{
  try {
    forgotPasswordValidation(req)
    const {password} =req.body

    const loggedInUser = req.user
    const isPassowrdSimilar = await req.user.validatePassword(password)
   if(isPassowrdSimilar) {
    throw new Error("Please try new password")
   }
  
    const hashedPassword = await bcrypt.hash(password, 10)
    loggedInUser["password"] = hashedPassword
    await loggedInUser.save()
  
    res.cookie("token", null, {
    expires: new Date(),
  })
  res.send("Password updated Successful!!!")
  } catch (error) {
    res.status(400).send("Error :" + error);
  }
})

module.exports = profileRouter;
