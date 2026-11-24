import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auths/middleware";
import groupChatController from "./controller";
import { groupChatSchema } from "./model";
import { validateSession } from "../auths/service";
import groupChatWebSocket from "./websocket";

const groupChatRouters = new Elysia({ prefix: "/api/v1/groups/chats" })
.use(apiAuthMiddleware)
.delete("/clear/bulk", async ({ body, user }) => {
    return await groupChatController.clearChosenMessages({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.deleteMessage, ["sender_id"])
})
.delete("/clear", async ({ query, user }) => {
    return await groupChatController.clearAllMessages({ ...query, sender_id: user.id });
}, {
    query: t.Omit(groupChatSchema.deleteMessage, ["message_ids", "sender_id"])
})
.delete("/bulk", async ({ body, user }) => {
    return await groupChatController.deleteChosenMessages({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.deleteMessage, ["sender_id"])
})
.delete("/", async ({ query, user }) => {
    return await groupChatController.deleteAllMessages({ ...query, sender_id: user.id });
}, {
    query: t.Omit(groupChatSchema.deleteMessage, ["message_ids", "sender_id"])
})
.get("/files", async ({ query }) => {
    return await groupChatController.showUploadedFilesByMessageId(query._id);
}, {
    query: t.Pick(groupChatSchema.changeMessage, ["_id"])
})
.get("/", async ({ query, user }) => {
    return await groupChatController.showAllMessages({ ...query, sender_id: user.id });
}, {
    query: t.Omit(groupChatSchema.additionalFilter, ["sender_id"])
})
.post("/", async ({ body, user }) => {
    return await groupChatController.sendMessage({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.sendMessageRaw, ["sender_id", "sender_name"])
})
.put("/", async ({ body, user }) => {
    return await groupChatController.changeChosenMessage({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.changeMessage, ["sender_id"])
})
.ws("/ws/:group_id", {
    params: t.Pick(groupChatSchema.wsConfig, ["group_id"]),
    query: t.Pick(groupChatSchema.wsConfig, ["token"]),

    async open(ws) {
        try {
            const groupId = ws.data.params.group_id;
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ message: "You are not allowed to access", type: "error" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const userId = session.user.id;

            if (!groupId || !userId || typeof userId !== "string" || typeof groupId !== "string") {
                ws.send(JSON.stringify({ message: "Invalid group or user", type: "error" }));
                ws.close(4002, "Invalid group or user");
                return;
            }

            groupChatWebSocket.addTunnel(groupId, ws);
        } catch (error) {
            ws.send(JSON.stringify({ message: "Connection failed", type: "error" }));
            ws.close(4003, "Internal error");
        }
    },

    message(ws, message) {
        const dataToSend = JSON.parse(message as string);
        if (dataToSend.type === "ping") ws.send(JSON.stringify({ type: "pong" }));
    },

    close(ws) {
        const groupId = ws.data.params.group_id;
        if (groupId) groupChatWebSocket.removeTunnel(groupId, ws);
    }
});

export default groupChatRouters;