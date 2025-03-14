const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose"); // use version 6.10.1
const cors = require("cors");
const Message = require("./models/message");
const Poll = require("./models/poll");

require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI;
console.log(MONGO_URI);

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.io Connection Handler
io.on("connection", (socket) => {
  console.log("New client connected");

  // Save message to database
  socket.on("send_message", async (messageData) => {
    try {
      // Create new message document
      const newMessage = new Message({
        content: messageData.content,
        sender: messageData.sender,
        roomId: messageData.roomId || "general",
      });

      // Save to database
      await newMessage.save();

      // Broadcast message to all clients
      io.emit("receive_message", newMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Fetch previous messages
  socket.on("fetch_messages", async (roomId = "general") => {
    try {
      const messages = await Message.find({ roomId })
        .sort({ timestamp: 1 })
        .limit(50); // Limit to last 50 messages

      socket.emit("previous_messages", messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });

  // In your socket.io server setup

  // Fetch polls
  socket.on("fetch_polls", async () => {
    try {
      const polls = await Poll.find({ roomId: "general" }).sort({
        createdAt: 1,
      });
      socket.emit("polls", polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  });

  // Create a new poll
  socket.on("create_poll", async (pollData) => {
    try {
      const newPoll = new Poll(pollData);
      await newPoll.save();
      io.emit("new_poll", newPoll);
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  });

  // Vote on a poll
  socket.on("vote_on_poll", async ({ pollId, optionIndex, voter }) => {
    try {
      // Find the poll
      const poll = await Poll.findOne({ id: pollId });

      if (!poll) return;

      // Check if user already voted on this poll
      const alreadyVoted = poll.options.some((option) =>
        option.voters.includes(voter)
      );

      if (alreadyVoted) return;

      // Add vote and voter
      poll.options[optionIndex].votes += 1;
      poll.options[optionIndex].voters.push(voter);

      // Save updated poll
      await poll.save();

      // Broadcast updated poll to all clients
      io.emit("poll_updated", poll);
    } catch (error) {
      console.error("Error voting on poll:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
