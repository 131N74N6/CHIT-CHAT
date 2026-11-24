import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auths/middleware";
import groupMemberController from "./controller";
import { groupMemberSchema } from "./model";
import { validateSession } from "../auths/service";
import groupMemberWebSocket from "./websocket";

const groupMemberRouters = new Elysia({ prefix: "/api/v1/groups/members" })
.use(apiAuthMiddleware)
.delete("/kick", async (context) => {
    return await groupMemberController.kickMember(context.body);
}, {
    body: groupMemberSchema.leftGroup
})
.delete("/left", async ({ query, user }) => {
    return await groupMemberController.leftGroup({ ...query, user_id: user.id });
}, {
    query: t.Pick(groupMemberSchema.leftGroup, ["group_id"])
})
.get("/", async ({ query }) => {
    return await groupMemberController.showAllMembers(query);
}, {
    query: groupMemberSchema.filter
})
.post("/", async ({ body, user }) => {
    return await groupMemberController.joinGroup({ group_id: body.group_id, user_id: user.id });
}, {
    body: t.Pick(groupMemberSchema.joinGroup, ["group_id"])
})
.ws("/ws/:group_id", {
    params: t.Pick(groupMemberSchema.wsConfig, ["group_id"]),
    query: t.Pick(groupMemberSchema.wsConfig, ["token"]),

    async open(ws) {
        try {
            const token = ws.data.query.token;
            const groupId = ws.data.params.group_id;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ message: "You are not allowed to access", type: "error" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const userId = session.user.id;

            if (!groupId || !userId || typeof userId !== "string" || typeof groupId !== "string") {
                ws.send(JSON.stringify({ message: "Invalid user or group", type: "error" }));
                ws.close(4002, "Invalid user or group");
                return;
            }
            
            groupMemberWebSocket.addTunnel(groupId, ws);
        } catch (error) {
            ws.send(JSON.stringify({ message: "Connection failed", type: "error" }));
            ws.close(4003, "internal error");
        }
    },

    message(ws, message) {
        const payload = JSON.parse(message as string);
        if (payload.type === "ping") ws.send(JSON.stringify({ type: "pong" }));
    },

    close(ws) {
        const groupId = ws.data.params.group_id;
        if (groupId) groupMemberWebSocket.removeTunnel(groupId, ws);
    }
});

export default groupMemberRouters;