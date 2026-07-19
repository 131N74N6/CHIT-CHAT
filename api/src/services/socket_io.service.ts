import express from "express";
import http from "http";
import { Server }  from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ["http://localhost:5173"] }
});

io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("join:available-room", (userId: string) => {
        socket.join(`available-room:${userId}`);
    });

    socket.on("join:available-user", (userId: string) => {
        socket.join(`available-user:${userId}`);
    });

    socket.on("join:room-chat", (roomId: string) => {
        socket.join(`room-chat:${roomId}`);
    });

    socket.on("join:room-member", (roomId: string) => {
        socket.join(`room-member:${roomId}`);
    });

    socket.on("join:room-profile", (roomId: string) => {
        socket.join(`room-profile:${roomId}`);
    });

    socket.on("join:user-chat", (userId: string) => {
        socket.join(`user-chat:${userId}`);
    });

    socket.on("join:user-profile", (userId: string) => {
        socket.join(`user-profile:${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

export { app, io, server }