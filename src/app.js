const express = require("express")

const app =express()

app.use("/user", [(req, res, next)=>{
    console.log("printed 1st route handler")
    next()
    res.send("1st response")
},
(req, res, next)=>{
        console.log("printed 2nd route handler")
res.send("2nd response")
next()
},
(req, res, next)=>{
        console.log("printed 3rd route handler")
res.send("3rd response")
// next()
},]
)



app.listen(8000,()=>{
    console.log("Server is running on the port 8000")
})