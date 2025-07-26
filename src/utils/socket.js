const socket = require("socket.io");
const crypto = require("crypto");
const socketAuth = require("../middlewares/socketAuth");
const  Chat  = require("../models/chat");
const ConnectionRequest =require("../models/connectionRequest")

const hashingTheRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: `${process.env.FRONTEND_URL}`,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = hashingTheRoomId(socket.user._id, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        if (!socket.user) {
          return socket.emit("unauthorized", "Please login again");
        }
        const roomId = hashingTheRoomId(socket.user._id, targetUserId);
        const userName = socket?.user?.firstName + " " + socket?.user?.lastName;
        // io.to(roomId).emit("receiveMessage", { userName, text });
        try {
        

            const isConnectionRequestValid = await ConnectionRequest.findOne({
            $or:[
              {senderId:userId, receiverId:targetUserId},
            {senderId:targetUserId, receiverId:userId},
            ],
            status:"accepted"
          })
console.log(isConnectionRequestValid)
          if(!isConnectionRequestValid){
             return socket.emit("chatError", "You can't message this user.");
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

        
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("receiveMessage", { userName, text });
        } catch (error) {
          socket.emit("chatError", error.message)
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.user?.firstName);
      socket.user = null;
    });
  });
};

module.exports = initializeSocket;
