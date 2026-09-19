import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import groupMemberController from "./controller";
import { groupMemberSchema } from "./model";
import { validateSession } from "../auth/service";
import { groupMemberEvent } from "./event";

const wsContext = new WeakMap<any, { roomId: string; handler: (data: any) => void }>();

const groupMemberRouters = new Elysia({ prefix: "/api/v1/groups/members" })
.use(apiAuthMiddleware)
.delete("/kick", async (context) => {
    return await groupMemberController.kickMember(context.query);
}, {
    query: groupMemberSchema.leftGroup
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
.ws("/ws", {
    query: groupMemberSchema.wsConfig,

    async open(ws) {
        try {
            const token = ws.data.query.token;
            const groupId = ws.data.query.group_id;
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
            
            const roomId = `member-from-group-${groupId}`;
            const handler = (data: any) => ws.send(JSON.stringify(data));

            groupMemberEvent.on(roomId, handler);
            wsContext.set(ws, { roomId, handler });
        } catch (error) {
            ws.send(JSON.stringify({ message: "Connection failed", type: "error" }));
            ws.close(4003, "internal error");
        }
    },

    close(ws) {
        const ctx = wsContext.get(ws);
        if (ctx) {
            groupMemberEvent.off(ctx.roomId, ctx.handler);
            wsContext.delete(ws);
        }
    }
});

export default groupMemberRouters;