const validator = require("validator");

const signUpValidation = (req) => {
  const { firstName, lastName, password, emailId } = req.body;
  const ALLOWED_UPDATES = ["firstName", "lastName", "emailId", "password"];
  const isupdateAllowed = Object.keys(req.body).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  if (!isupdateAllowed) {
    throw new Error("Update not allowed");
  } else if (!firstName || !lastName) {
    throw new Error("Please enter the valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter the valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const loginValidation = (req) => {
  const { emailId } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Login Details");
  }
};

const validateEditProfileData = (req) => {
  const allowedDataFields = ["age", "gender", "skills", "firstName", "lastName", "profiePic", "about"];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    allowedDataFields.includes(fields)
  );
  return isEditAllowed;
};

const forgotPasswordValidation = (req) => {
  const { password } = req.body;

  if (!validator.isStrongPassword(password)) {
    throw new Error("Your Password is not strong");
  }
};
module.exports = {
  signUpValidation,
  loginValidation,
  validateEditProfileData,
  forgotPasswordValidation,
};
