const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength:2,
    maxLength:20
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required:true,
    unique:true,
    trim: true,
    lowercase:true,
    validate(value) {
     if(! validator.isEmail(value)){
      throw new Error("Email is not valid:", value)
     }
    }
  },
  password: {
    type: String,
    required:true,
    trim:true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Your Password is not strong:", value)
      }
    }
  },
  age: {
    type: Number,
    min:18
  },
  isSubscribed:{
    type: Boolean,
    default:false
  },
  profilePic:{
    type:String,
    trim:true,
    // validate(value){
    //   if(!validator.isURL(value)){
    //     throw new Error("Your Photo URL is not valid:", value)
    //   }
    // },
    default:null,
  },
  skills:{
    type:[String]
  },
  gender: {
    type: String,
    trim:true,
    validate(value){
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid")
      }
    }
  },
}, {timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;
