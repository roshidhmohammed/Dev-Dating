const express = require("express")

const app =express()
app.get('/user/:userId/:name', (req, res)=>{
    // console.log(req.query)
    console.log(req.params)
    res.send({firstName:"Mohammed", lastName:"Roshidh s"})
})
// app.get("/user", (req,res)=>{
//     res.send("Successfully retrieved the user")
// })

// app.post("/user", (req,res)=>{
//     res.send("Successfully created the user")
// })

// app.delete("/user", (req,res)=>{
//     res.send("Successully deleted the user")
// })

// app.put("/user", (req,res)=>{
//     res.send("Successully updated the user profile")
// })



app.listen(8000,()=>{
    console.log("Server is running on the port 8000")
})