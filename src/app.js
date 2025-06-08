const express = require("express")

const app =express()

app.use("/server", (req, res)=>{
    res.send("Hii from the serve")
})

app.use("/test", (req, res)=>{
    res.send("Hii from the test")
})

app.listen(8000,()=>{
    console.log("Server is running on the port 8000")
})