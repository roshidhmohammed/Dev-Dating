const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpValidation,
  loginValidation
 } = require("./utils/validation");
const bcrypt =require("bcrypt")
const cookieParser  = require("cookie-parser")
const json =require("jsonwebtoken")

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
      const token =await  json.sign({_id:user?._id}, "Roshidh123@")
      console.log(token)
      res.cookie("token", token)
      res.send("Login Successfull!")
    }
  } catch (error) {
    res.status(400).send('Error :' +  error);
  }
})

app.use("/profile", async(req, res)=>{
  try {
    const userCookie = req.cookies
  
    if(userCookie){
      const verifiedToken = await json.verify(userCookie.token,"Roshidh123@" )
      if(verifiedToken === null){
         throw new Error("Please Login")
      }
      const user = await User.findById(verifiedToken?._id)
      res.send(user)
    }
  
  
    
  } catch (error) {
     res.status(400).send('Error :' +  error);
  }
})

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["profilePic", "skills", "gender", "age"];
    const isupdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isupdateAllowed) {
      throw new Error("Update not allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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
