import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your Vite dev server
    methods: ["GET", "POST"],
  },
});

// Store connected users
const users = new Map();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle user joining
  socket.on("join", ({ userId, userName }) => {
    users.set(socket.id, { userId, userName });
    console.log(`${userName} (ID: ${userId}) joined the chat`);

    // Broadcast online users
    const onlineUsers = Array.from(users.values());
    io.emit("users_update", onlineUsers);
  });

  // Handle sending messages
  socket.on("send_message", (message) => {
    console.log("Message received:", message);

    // Broadcast the message to all connected clients
    io.emit("receive_message", {
      ...message,
      timestamp: new Date().toISOString(),
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      console.log(`${user.userName} disconnected`);
      users.delete(socket.id);

      // Broadcast updated online users
      const onlineUsers = Array.from(users.values());
      io.emit("users_update", onlineUsers);
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
