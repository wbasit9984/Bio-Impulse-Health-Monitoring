import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

app.use(cors({
    origin: "https://sick-or-not-dection.onrender.com",
    credentials: true
  }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "https://sick-or-not-dection.onrender.com",
      methods: ["GET", "POST"],
      credentials: true
    },
});

export const getRecipientSocketID = (recipientID) => {
    return userSocketMap[recipientID];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("user connnected", socket.id);
    const userId = socket.handshake.auth.userId;
    console.log(userId)
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    console.log(userSocketMap)

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { server, app, io };
