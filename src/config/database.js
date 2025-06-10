const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://MohammedRoshidh:Roshidh75111@namastenode.3sruwag.mongodb.net/devDating"
  );
};

module.exports =connectDB

