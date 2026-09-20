import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import groupChatController from "./controller";
import { groupChatSchema } from "./model";
import { validateSession } from "../auth/service";
import { groupChatEvent } from "./event";

const wsContext = new WeakMap<any, { roomId: string; handler: (data: any) => void }>();

const groupChatRouters = new Elysia({ prefix: "/api/v1/groups/chats" })
.use(apiAuthMiddleware)
.delete("/clear/bulk", async ({ body, user }) => {
    return await groupChatController.clearChosenMessages({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.deleteMessage, ["sender_id"])
})
.delete("/clear", async ({ query, user }) => {
    return await groupChatController.clearAllMessages({ ...query, sender_id: user.id })
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
    return await groupChatController.sendMessage({ ...body, sender_id: user.id, sender_name: user.name });
}, {
    body: t.Omit(groupChatSchema.sendMessageRaw, ["sender_id", "sender_name"])
})
.put("/", async ({ body, user }) => {
    return await groupChatController.changeChosenMessage({ ...body, sender_id: user.id });
}, {
    body: t.Omit(groupChatSchema.changeMessage, ["sender_id"])
})
.ws("/ws", {
    query: groupChatSchema.wsConfig,

    async open(ws) {
        try {
            const groupId = ws.data.query.group_id;
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ message: "You are not allowed to access", type: "error" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const senderId = session.user.id;

            if (!groupId || !senderId || typeof senderId !== "string" || typeof groupId !== "string") {
                ws.send(JSON.stringify({ message: "invalid group or user", type: "error" }));
                ws.close(4002, "invalid group or user");
                return;
            }

            const handler = (data: any) => ws.send(JSON.stringify(data));

            groupChatEvent.on(groupId, handler );
            wsContext.set(ws, { roomId: groupId, handler });
        } catch (error) {
            ws.send(JSON.stringify({ message: "connection failed", type: "error" }));
            ws.close(4003, "internal error");
        }
    },

    close(ws) {
        const ctx = wsContext.get(ws);
        if (ctx) {
            groupChatEvent.off(ctx.roomId, ctx.handler);
            wsContext.delete(ws);
        }
    }
});

export default groupChatRouters;