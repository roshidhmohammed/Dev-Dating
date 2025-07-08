const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors")

app.use(cors({
  origin:"http://13.233.2.135",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());

require("dotenv").config({
  path:"src/config/.env"
})

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);



connectDB()
  .then(() => {
    console.log("DB connection is established");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on the port ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.error("DB connection failed");
  });
