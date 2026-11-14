import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import userProfileController from "./controller";
import { userProfileSchema } from "./model";
import { validateSession } from "../auth/service";
import { addTunnel, removeTunnel } from "./websocket";

const userProfileRouters = new Elysia({ prefix: "/api/v1/users" })
.use(apiAuthMiddleware)
.delete("/profile-picture", async (context) => {
    return await userProfileController.deleteUserProfilePicture(context.user.id);
})
.delete("/", async (context) => {
    return await userProfileController.deleteUser(context.user.id);
})
.get("/all", async (context) => {
    return await userProfileController.showAllUsers({ id: context.user.id, ...context.query });
}, {
    query: t.Pick(userProfileSchema.showAllUser, ["limit", "page"])
})
.get("/session", async (context) => {
    const token = context.cookie['better-auth.session_token'].value;
    return { data: token };
})
.get("/me", async (context) => {
    return await userProfileController.showUser({ id: context.user.id });
})
.get("/", async (context) => {
    return await userProfileController.showUser({ id: context.query.id });
}, {
    query: userProfileSchema.showUser
})
.put("/", async (context) => {
    return await userProfileController.changeUser({ id: context.user.id, ...context.body });
}, {
    body: t.Omit(userProfileSchema.changeRaw, ["id"])
})
.ws("/ws", {
    query: userProfileSchema.wsConfig,

    async open(ws) {
        try {
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ type: "error", message: "You are not allowed to access" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const userId = session.user.id;

            if (!userId || typeof userId !== "string") {
                ws.send(JSON.stringify({ type: "error", message: "Invalid user" }));
                ws.close(4002, "Invalid user");
                return;
            }
            
            if (userId) addTunnel(userId, ws);
        } catch (error) {
            ws.send(JSON.stringify({ type: "error", message: "Connection failed" }));
            ws.close(4003, "Internal error");
        }
    },

    message(ws, message) {
        const data = JSON.parse(message as string);
        if (data.type === "ping") ws.send(JSON.stringify({ type: "pong" }));
    },

    close(ws) {
        const userId = ws.data.user.id;
        if (userId) removeTunnel(userId, ws);
    }
});

export default userProfileRouters;