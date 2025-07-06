const json = require("jsonwebtoken")
const User = require("../models/user")


const userAuth  =async(req, res, next) =>{
  try {
    const {token} = req.cookies
    if(!token) {
      return res.status(401).send("Please login again!")
    }

    const decodedObj = await json.verify(token, "Roshidh123@")
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
    res.status(400).send("Error:" + error.message)
  }
}

module.exports= {
    userAuth
}