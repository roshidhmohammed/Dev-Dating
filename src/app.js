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


app.use("/admin/getAllData",adminAuth,  (req, res, next) => {
  res.send("Retrieved all the data")
});

app.use("/admin/deleteAllData",adminAuth, (req, res, next) => {
  res.send("Successfully deleted all the data");
});

app.listen(8000, () => {
  console.log("Server is running on the port 8000");
});
