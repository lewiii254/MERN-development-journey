const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      votes: {
        type: Number,
        default: 0,
      },
      voters: [
        {
          type: String,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roomId: {
    type: String,
    default: "general",
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
});

const Poll = mongoose.model("Poll", PollSchema);

module.exports = Poll;
