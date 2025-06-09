const express = require("express");
const { adminAuth } = require("../middlewares/auth");

const app = express();

// app.use("/user", [(req, res, next)=>{
//     console.log("printed 1st route handler")
//     next()
//     res.send("1st response")
// },
// (req, res, next)=>{
//         console.log("printed 2nd route handler")
// res.send("2nd response")
// next()
// },
// (req, res, next)=>{
//         console.log("printed 3rd route handler")
// res.send("3rd response")
// // next()
// },]
// )


app.use("/getUserData", (req, res, next)=>{
    throw new Error("xgjffgh")
   res.send("user data send")
})

app.use("/user", (req, res, next)=>{
 try {
      throw new Error("xgjffgh")
//    res.send("user data send")
 } catch (error) {
    res.status(500).send("server is crashed")
 }
})

app.use("/", (err, req, res, next) =>{
    if(err) {
        res.status(500).send("Something went wrong")
    }
})



app.listen(8000, () => {
  console.log("Server is running on the port 8000");
});
