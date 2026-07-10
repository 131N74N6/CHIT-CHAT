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

    socket.on("join:room", (roomId: string) => {
        socket.join(`room:${roomId}`);
    });

    socket.on("join:receiver", (userId: string) => {
        socket.join(`receiver:${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

export { app, io, server }