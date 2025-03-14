## Images

![The login page](/frontend/public/assets/images/login.png)
![The chat room](/frontend/public/assets/images/chat-room.png)

## Introduction

This documentation provides a comprehensive guide to building real-time applications using Socket.io with MongoDB for data persistence and React for the frontend. This stack is ideal for creating interactive applications like chat platforms, collaborative tools, live dashboards, and multiplayer games.

## Table of Contents

1. [Technology Overview](#technology-overview)
2. [Setup and Installation](#setup-and-installation)
3. [Project Structure](#project-structure)
4. [Server Implementation](#server-implementation)
5. [Database Configuration](#database-configuration)
6. [Client Implementation](#client-implementation)
7. [Real-time Communication](#real-time-communication)
8. [Advanced Features](#advanced-features)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Technology Overview

- **Socket.io**: A library that enables real-time, bidirectional communication between web clients and servers
- **MongoDB**: A NoSQL document database for storing application data
- **React**: A JavaScript library for building user interfaces
- **Express**: A web application framework for Node.js
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB

## Setup and Installation

```bash
git clone https://github.com/tbrowns/chat-app-sockets.git

cd chat-app-sockets

```

### Server Setup

```bash

cd backend


# Install dependencies
npm install
```

### Client Setup

```bash
# Navigate to client directory
cd frontend

# Install dependencies
npm install
```

## Project Structure

```
/project-root
├── backend/
│   ├── models/
│   │   └── Message.js
│   │   └── Poll.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Chat.js
│   │   │   └── MessageList.js
│   │   │   └── MessageForm.js
│   │   ├── context/
│   │   │   └── SocketContext.js
│   │   ├── services/
│   │   │   └── socketService.js
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

### Using MongoDB Atlas (Alternative to Local MongoDB)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update your .env file with the connection string

## Real-time Communication

### Socket.io Events

| Event             | Direction       | Description                             |
| ----------------- | --------------- | --------------------------------------- |
| `connection`      | Client → Server | Triggered when a client connects        |
| `disconnect`      | Client → Server | Triggered when a client disconnects     |
| `join_room`       | Client → Server | Client requests to join a specific room |
| `send_message`    | Client → Server | Client sends a new message              |
| `receive_message` | Server → Client | Server broadcasts a message to clients  |
| `get_messages`    | Client → Server | Client requests message history         |
| `message_history` | Server → Client | Server sends message history to client  |
| `typing`          | Client → Server | Client sends typing status              |

## Deployment

### Server Deployment (Node.js + MongoDB)

- Render

### Client Deployment (React)

- Vercel

## Conclusion

This integration of Socket.io with MongoDB and React provides a robust foundation for building real-time applications. By following the patterns outlined in this documentation, you can create scalable, maintainable, and feature-rich applications that deliver real-time experiences to your users.

## Resources

- [Socket.io Documentation](https://socket.io/docs/v4)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [React Documentation](https://reactjs.org/docs)
- [Express Documentation](https://expressjs.com/en/api.html)
