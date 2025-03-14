import { useState, useEffect, useRef, useCallback } from "react";
import io from "socket.io-client";
import PollCreator from "./poll-creator";
import PollDisplay from "./poll-display";

// Socket connection
const live = "https://chat-app-sockets-il7x.onrender.com";
// const local = "http://localhost:5000";

const socket = io(live);

// Function to generate a consistent color from a string
function stringToColor(str) {
  // Pre-defined color palette for better readability and aesthetics
  const colors = [
    "#2563EB", // blue-600
    "#7C3AED", // violet-600
    "#DB2777", // pink-600
    "#DC2626", // red-600
    "#D97706", // amber-600
    "#059669", // emerald-600
    "#0891B2", // cyan-600
    "#4F46E5", // indigo-600
    "#7E22CE", // purple-600
    "#BE123C", // rose-700
    "#B45309", // amber-700
    "#047857", // emerald-700
    "#0E7490", // cyan-700
    "#4338CA", // indigo-700
    "#6D28D9", // purple-700
  ];

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick a color from our palette
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userColors, setUserColors] = useState({});
  const [polls, setPolls] = useState([]);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Handle username submission
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);

      // Fetch previous messages after login
      socket.emit("fetch_messages");
      socket.emit("fetch_polls");
    }
  };

  // Fetch previous messages and polls on component mount
  useEffect(() => {
    if (!isLoggedIn) return;

    // Listen for previous messages
    socket.on("previous_messages", (fetchedMessages) => {
      setMessages(fetchedMessages);

      // Generate colors for all unique usernames
      const colors = {};
      fetchedMessages.forEach((msg) => {
        if (!colors[msg.sender]) {
          colors[msg.sender] = stringToColor(msg.sender);
        }
      });
      setUserColors(colors);
    });

    // Listen for new messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Add color for new user if needed
      setUserColors((prev) => {
        if (!prev[newMessage.sender]) {
          return {
            ...prev,
            [newMessage.sender]: stringToColor(newMessage.sender),
          };
        }
        return prev;
      });
    });

    // Listen for polls
    socket.on("polls", (fetchedPolls) => {
      setPolls(fetchedPolls);
    });

    // Listen for new poll
    socket.on("new_poll", (newPoll) => {
      setPolls((prev) => [...prev, newPoll]);
    });

    // Listen for poll updates
    socket.on("poll_updated", (updatedPoll) => {
      setPolls((prev) =>
        prev.map((poll) => (poll.id === updatedPoll.id ? updatedPoll : poll))
      );
    });

    // Cleanup listeners
    return () => {
      socket.off("previous_messages");
      socket.off("receive_message");
      socket.off("polls");
      socket.off("new_poll");
      socket.off("poll_updated");
    };
  }, [isLoggedIn]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Emit message to server
      socket.emit("send_message", {
        content: inputMessage,
        sender: username,
        roomId: "general", // Default room
      });

      // Clear input
      setInputMessage("");
    }
  };

  // Create poll handler
  const handleCreatePoll = (pollData) => {
    const newPoll = {
      id: Date.now().toString(),
      creator: username,
      question: pollData.question,
      options: pollData.options.map((option) => ({
        text: option,
        votes: 0,
        voters: [],
      })),
      createdAt: new Date().toISOString(),
    };

    socket.emit("create_poll", newPoll);
    setShowPollCreator(false);
  };

  // Vote on poll handler
  const handleVote = (pollId, optionIndex) => {
    socket.emit("vote_on_poll", {
      pollId,
      optionIndex,
      voter: username,
    });
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setMessages([]);
    setInputMessage("");
    setPolls([]);
    // We're not disconnecting from socket to allow for quick re-login
  };

  // Login screen
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 ">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
            Welcome to Chat App
          </h2>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Choose a username to continue
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat interface
  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-indigo-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Chat Room{" "}
            <span className="text-indigo-100 text-sm">({username})</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPollCreator(true)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Create Poll
          </button>
          <button
            onClick={handleLogout}
            className="bg-indigo-700 hover:bg-indigo-800 text-white px-3 py-1 rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages and Polls Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 && polls.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 italic">
              No messages or polls yet. Start the conversation!
            </p>
          </div>
        ) : (
          <>
            {/* Render messages and polls in chronological order */}
            {[...messages, ...polls]
              .sort(
                (a, b) =>
                  new Date(a.createdAt || a.timestamp) -
                  new Date(b.createdAt || b.timestamp)
              )
              .map((item, index) => {
                // Check if item is a message
                if (item.content !== undefined) {
                  const msg = item;
                  return (
                    <div
                      key={`msg-${index}`}
                      className={`mb-4 max-w-[80%] ${
                        msg.sender === username ? "ml-auto" : "mr-auto"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-lg shadow-sm ${
                          msg.sender === username
                            ? "bg-indigo-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          <span
                            className="font-medium"
                            style={{
                              color:
                                msg.sender === username
                                  ? "#ffffff"
                                  : userColors[msg.sender] || "#4F46E5",
                            }}
                          >
                            {msg.sender === username ? "You" : msg.sender}
                          </span>
                        </div>
                        <p className="break-words text-left">{msg.content}</p>
                        <div
                          className={`text-xs mt-1 text-right ${
                            msg.sender === username
                              ? "text-indigo-200"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }
                // Otherwise it's a poll
                else {
                  const poll = item;
                  return (
                    <PollDisplay
                      key={`poll-${poll.id}`}
                      poll={poll}
                      currentUser={username}
                      onVote={handleVote}
                      userColors={userColors}
                    />
                  );
                }
              })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 bg-white p-4 flex items-center"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Send
        </button>
      </form>

      {/* Poll Creator Modal */}
      {showPollCreator && (
        <PollCreator
          onClose={() => setShowPollCreator(false)}
          onCreatePoll={handleCreatePoll}
        />
      )}
    </div>
  );
}

export default ChatComponent;
