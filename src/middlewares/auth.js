const json = require("jsonwebtoken")
const User = require("../models/user")


const userAuth  =async(req, res, next) =>{
  try {
    const {token} = req.cookies
    if(!token) {
      throw new Error("Please Login Again")
    }

    const decodedObj = await json.verify(token, "Roshidh123@")
    if(!decodedObj){
      throw new Error("User session expired")
    }
    const {_id} = decodedObj
    const user =await User.findById(_id)

    if(!user){
      throw new Error("Token is not valid")
    }
    req.user = user
    next()
  } catch (error) {
    res.status(400).send("Error:" + error.message)
  }
}

module.exports= {
    userAuth
}