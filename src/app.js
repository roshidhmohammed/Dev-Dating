const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors")
const path= require("path")
const dotenv = require("dotenv")

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());

const ENV= process.env.NODE_ENV || "development"

dotenv.config({
  path: path.resolve(__dirname, `./config/.${process.env.NODE_ENV}.env`)
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
