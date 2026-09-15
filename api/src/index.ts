import { Elysia } from "elysia";
import { setupErrorHandler } from "./error/handler";
import cors from "@elysiajs/cors";
import { authServiceApi } from "./auth/service";
import { v2 } from "cloudinary";
import userChatRouters from "./user_chats/router";
import groupChatRouters from "./group_chats/router";

const port = import.meta.env.PORT || 3000;

v2.config({
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
});

const app = new Elysia()
.use(setupErrorHandler)
.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:3000"]
}))
.all("/api/auth/*", async (ctx) => await authServiceApi.handler(ctx.request))
.use(groupChatRouters)
.use(userChatRouters)
.get("/", () => "🦊 Hello Elysia")
.get("/api", () => "🦊 Elysia API is ready 🚀")
.get("/api/v1", () => "🦊 Elysia API current version: 1.0 🚀")
.listen(port, () => console.log(`🦊 Elysia is running at http://localhost:${port}`));

export type App = typeof app;
export default app;