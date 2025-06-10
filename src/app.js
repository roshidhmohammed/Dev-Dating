const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json())

app.post("/sign-up" ,async(req, res)=>{
  const user = new User(req.body)
  try {
    await user.save()
    res.send("User Created Successfully")
  } catch (error) {
    res.status(400).send("Failed to create a user")
  }
})

app.get("/user", async(req, res)=> {
  const userEmail = req.body.emailId
  try {
    const user = await User.findOne({emailId:userEmail})
    if(!user){
      res.status(404).send("User not found")
    }
    res.send(user)
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
})

app.get("/feed", async(req, res) =>{
  try {
    const users = await User.find()
    res.send(users)
  } catch (error) {
    res.status(400).send("Something went wrong")
  }
})

app.delete("/user", async(req, res)=>{
  const userId = req.body.userId
  try {
      await User.findByIdAndDelete(userId)
    res.send("User deleted successfully")
  } catch (error) {
    res.status(400).send("Something went wrong")
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
