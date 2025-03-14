const mongoose = require("mongoose");

// Message Schema
const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: String,
    default: "general",
  },
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
