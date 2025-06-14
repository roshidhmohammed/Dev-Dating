const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpValidation,
  loginValidation
 } = require("./utils/validation");
const bcrypt =require("bcrypt")
const cookieParser  = require("cookie-parser")
const json =require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser())

app.post("/sign-up", async (req, res) => {
  
  try {
    signUpValidation(req)
    const {password, firstName, lastName, emailId} = req.body
    const hashedPassword =await bcrypt.hash(password, 1 )
    const user = new User({
      firstName,
      lastName,
      emailId,
      password:hashedPassword
    });
   
    const isEmailExist = await User.findOne({ emailId:emailId });
    if (isEmailExist) {
      throw new Error("Email Id already exist");
    }
    await user.save();
    res.send("User Created Successfully");
  } catch (error) {
    res.status(400).send(`Error : ${error.message}`);
  }
});


app.post("/login", async(req, res) =>{
  try {
    const {emailId, password} = req.body
    loginValidation(req)
    const user = await User.findOne({emailId})
    if(!user) {
      throw new Error("Invalid Login Details")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      throw new Error("Invalid Login Details")
    } else {
      const token =await  json.sign({_id:user?._id}, "Roshidh123@", {expiresIn:"1d"})
      res.cookie("token", token, {expires:new Date(Date.now() + 24 * 3600000)})
      res.send("Login Successfull!")
    }
  } catch (error) {
    res.status(400).send('Error :' +  error);
  }
})

app.use("/profile", userAuth, async(req, res)=>{
  try {
    const user = req.user
      res.send(user)

    
  } catch (error) {
     res.status(400).send('Error :' +  error);
  }
})

app.post("/send-connection-request",userAuth, async(req, res, next) =>{
  try {
    const user = req.user
    res.send(user.firstName + " sent connection request")
  } catch (error) {
    res.status(400).send('Error :' +  error);
  }
})

connectDB()
  .then(() => {
    console.log("DB connection is established");
    app.listen(8000, () => {
      console.log("Server is running on the port 8000");
    });
  })
  .catch(() => {
    console.error("DB connection failed");
  });
