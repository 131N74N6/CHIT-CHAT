import dns from "node:dns/promises";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "production") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("dns server: 1.1.1.1 or 8.8.8.8");
}

import { mongodb } from "./services/mongodb.service";
import { v2 } from "cloudinary";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./services/socket-io.service";
import userRouters from "./routers/user.router";
import authRouters from "./routers/auth.router";
import chatsRouters from "./routers/chat.router";
import chatBotRouters from "./routers/chatbot.router";
import roomRouters from "./routers/room.router";

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        "http://localhost:4000",
        "http://localhost:5173"
    ]
}));
app.use("/api/auths", authRouters);
app.use("/api/chats", chatsRouters);
app.use("/api/chatbots", chatBotRouters);
app.use("/api/rooms", roomRouters);
app.use("/api/users", userRouters);

if (process.env.NODE_ENV !== "production") {
    mongodb.then(() => {
        server.listen(4000, () => console.log("api running on http://localhost:4000"));
    });
}

export default app;