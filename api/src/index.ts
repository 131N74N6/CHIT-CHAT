import dns from "node:dns/promises";
import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "production") {
    dns.setServers(["1.1.1.1", "8.8.8.8"]);
    console.log("dns server: 1.1.1.1 or 8.8.8.8");
}

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouters from "./routers/user.router";
import authRouters from "./routers/auth.router";
import docsRouters from "./routers/chat.router";
import { mongodb } from "./services/mongodb.service";
import { v2 } from "cloudinary";

const app = express();

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
app.use("/api/docs", docsRouters);
app.use("/api/users", userRouters);

if (process.env.NODE_ENV !== "production") {
    mongodb.then(() => {
        app.listen(4000, () => console.log("api running on http://localhost:4000"));
    });
}

export default app;