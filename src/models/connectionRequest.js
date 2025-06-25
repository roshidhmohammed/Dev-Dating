const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect sttaus type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }); //compound index

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.senderId.equals(connectionRequest.receiverId)) {
    throw new Error("You can't send this request");
  }
  next();
});
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
