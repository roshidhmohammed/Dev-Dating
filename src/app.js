const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors")
const path= require("path")
const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(__dirname, `./config/.${process.env.NODE_ENV}.env`)
})

require("./utils/cronjob")

app.use(cors({
  origin:`${process.env.FRONTEND_URL}`,
  credentials:true
}))

app.use(express.json());
app.use(cookieParser());




const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);



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


