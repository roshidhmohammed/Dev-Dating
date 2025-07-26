const json = require("jsonwebtoken")
const User = require("../models/user")


const userAuth  =async(req, res, next) =>{
  try {
    const {token} = req.cookies
    // console.log("token received", token)
    if(!token) {
      return res.status(401).send("Please login again!")
    }

    const decodedObj = await json.verify(token, `${process.env.JWT_SECRET_KEY}`)
    if(!decodedObj){
      return res.status(401).send("Please login again!")
    }
    const {_id} = decodedObj
    const user =await User.findById(_id)

    if(!user){
      return res.status(401).send("Please login again!")
    }
    req.user = user
    next()
  } catch (error) {
    res.status(401).send("Error:" + error.message)
  }
}

module.exports= {
    userAuth
}