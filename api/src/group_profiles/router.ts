import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auths/middleware";
import groupProfileController from "./controller";
import { groupProfileSchema, TGroupProfile } from "./model";
import { validateSession } from "../auths/service";
import groupProfileWebSocket from "./websocket";

const groupProfileRouters = new Elysia({ prefix: "/api/v1/groups" })
.use(apiAuthMiddleware)
.delete("/", async (context) => {
    return await groupProfileController.deleteGroup({ 
        group_id: context.query.group_id, owner_id: context.user.id
    });
}, {
    query: t.Pick(groupProfileSchema.deleteGroup, ["group_id"])
})
.get("/", async (context) => {
    return await groupProfileController.showAllGroups({ ...context.query, user_id: context.user.id });
}, {
    query: t.Omit(groupProfileSchema.filter, ["user_id"])
})
.get("/:_id", async (context) => {
    return await groupProfileController.showGroupDetail(context.params._id);
}, {
    params: t.Pick(groupProfileSchema.changeGroupRaw, ["_id"])
})
.post("/", async (context) => {
    return await groupProfileController.createGroup({ 
        group_description: context.body.group_description,
        group_name: context.body.group_name,
        group_profile: context.body.group_profile,
        owner_id: context.user.id 
    });
}, {
    body: t.Omit(groupProfileSchema.createGroupRaw, ["owner_id"])
})
.put("/", async (context) => {
    return await groupProfileController.changeGroup({
        _id: context.body._id, 
        group_description: context.body.group_description,
        group_name: context.body.group_name,
        group_profile: context.body.group_profile,
        owner_id: context.user.id, 
    });
}, {
    body: t.Omit(groupProfileSchema.changeGroupRaw, ["owner_id"])
})
.put("/:_id", async (context) => {
    return await groupProfileController.deleteGroupProfilePicture({ 
        group_id: context.params._id, owner_id: context.user.id 
    });
}, {
    params: t.Pick(groupProfileSchema.changeGroupRaw, ["_id"])
})
.ws("/ws/:group_id", {
    params: t.Pick(groupProfileSchema.wsConfig, ["group_id"]),
    query: t.Pick(groupProfileSchema.wsConfig, ["token"]),

    async open(ws) {
        try {
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ type: "error", message: "You are not allowed to access" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const groupId = ws.data.params.group_id;

            if (!groupId || typeof groupId !== "string") {
                ws.send(JSON.stringify({ type: "error", message: "Invalid group" }));
                ws.close(4002, "Invalid group");
                return;
            }

            if (groupId) groupProfileWebSocket.addTunnel(groupId, ws);
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
        const groupId = ws.data.params.group_id;
        if (groupId) groupProfileWebSocket.removeTunnel(groupId, ws);
    }
});

export default groupProfileRouters;