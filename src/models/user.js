const mongoose = require("mongoose");
const validator = require("validator");
const json = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // index:true,
      minLength: 2,
      maxLength: 20,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true, //automaticall y create index
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid:", value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Your Password is not strong:", value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    about:{
      type:String,
      default:""
    },
    profilePic: {
      type: String,
      trim: true,
      default: null,
    },
    skills: {
      type: [String],
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
  },
  { timestamps: true }
);
console.log(process.env.JWT_SECRET_KEY)
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await json.sign({ _id: user?._id }, `${process.env.JWT_SECRET_KEY}`, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const hashedPassword = user?.password;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    hashedPassword
  );
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
