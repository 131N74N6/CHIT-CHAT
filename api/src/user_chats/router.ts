import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import userChatController from "./controller";
import { userChatSchema } from "./model";
import { userChatEvent } from "./event";
import { validateSession } from "../auth/service";

const wsContext = new WeakMap<any, { roomId: string; handler: (data: any) => void }>();

const userChatRouters = new Elysia({ prefix: "/api/v1/user-chats" })
.use(apiAuthMiddleware)
.delete("/clear/bulk", async ({ body, user }) => {
    return await userChatController.clearChosenMessage({ ...body, sender_id: user.id });
}, {
    body: t.Omit(userChatSchema.deleteChat, ["sender_id"])
})
.delete("/clear", async ({ query, user }) => {
    return await userChatController.clearAllMessages({ ...query, sender_id: user.id });
}, {
    query: t.Pick(userChatSchema.deleteChat, ["receiver_id"])
})
.delete("/bulk", async ({ body, user }) => {
    return await userChatController.deleteChosenMessages({ ...body, sender_id: user.id });
}, {
    body: t.Omit(userChatSchema.deleteChat, ["sender_id"])
})
.delete("/", async ({ query, user }) => {
    return await userChatController.deleteAllMessages({ ...query, sender_id: user.id });
}, {
    query: t.Pick(userChatSchema.deleteChat, ["receiver_id"])
})
.get("/files/:_id", async ({ params }) => {
    return await userChatController.showChosenMessageFiles(params._id);
}, {
    params: t.Pick(userChatSchema.changeMessageResult, ["_id"])
})
.get("/", async ({ query, user }) => {
    return await userChatController.showAllMessages({ ...query, sender_id: user.id })
}, {
    query: t.Omit(userChatSchema.messagePagination, ["sender_id", "skip"])
})
.post("/", async ({ body, user }) => {
    return await userChatController.sendMessages({ ...body, sender_id: user.id });
}, {
    body: t.Omit(userChatSchema.sendMessageRaw, ["sender_id"])
})
.put("/", async ({ body, user }) => {
    return await userChatController.changeChosenMessage({ ...body, sender_id: user.id });
}, {
    body: t.Omit(userChatSchema.changeMessageResult, ["sender_id"])
})
.ws("/ws/:receiver_id", {
    params: t.Pick(userChatSchema.wsConfig, ["receiver_id"]),
    query: t.Pick(userChatSchema.wsConfig, ["token"]),

    async open(ws) {
        try {
            const token = ws.data.query.token;
            const receiverId = ws.data.params.receiver_id;
            const session = await validateSession(token);
            
            if (!session || !session.user) {
                ws.send(JSON.stringify({ type: "error", message: "You are not allowed to access" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const senderId = session.user.id;

            if (!senderId || !receiverId || typeof senderId !== "string" || typeof receiverId !== "string") {
                ws.send(JSON.stringify({ type: "error", message: "Invalid user" }));
                ws.close(4002, "Invalid user");
                return;
            }

            const roomId = [senderId, receiverId].sort().join("_");
            const handler = (data: any) => ws.send(JSON.stringify(data));

            userChatEvent.on(roomId, handler);
            wsContext.set(ws, { roomId, handler });
            
            ws.send(JSON.stringify({ type: "connected", message: "You're connected" }));
        } catch (error) {
            ws.send(JSON.stringify({ type: "error", message: "Connection failed" }));
            ws.close(4003, "Internal error");
        }
    },

    close(ws) {
        const ctx = wsContext.get(ws);
        if (ctx) {
            userChatEvent.off(ctx.roomId, ctx.handler);
            wsContext.delete(ws);
        }
    }
});

export default userChatRouters;