import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import groupProfileController from "./controller";
import { groupProfileSchema, TGroupProfile } from "./model";
import { validateSession } from "../auth/service";
import { groupProfileEvent } from "./event";

const wsContext = new WeakMap<any, TGroupProfile["wsSubscription"][]>();

const groupProfileRouters = new Elysia({ prefix: "/api/v1/groups" })
.use(apiAuthMiddleware)
.delete("/:group_id", async (context) => {
    return await groupProfileController.deleteGroup({ 
        group_id: context.params.group_id, user_id: context.user.id
    });
}, {
    body: t.Pick(groupProfileSchema.deleteGroup, ["group_id"])
})
.get("/", async (context) => {
    return await groupProfileController.showAllGroups(context.query);
}, {
    query: groupProfileSchema.filter
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
        user_id: context.user.id 
    });
}, {
    body: t.Omit(groupProfileSchema.createGroupRaw, ["user_id"])
})
.put("/", async (context) => {
    return await groupProfileController.changeGroup({
        _id: context.body._id, 
        group_description: context.body.group_description,
        group_name: context.body.group_name,
        group_profile: context.body.group_profile,
        user_id: context.user.id, 
    });
}, {
    body: t.Omit(groupProfileSchema.changeGroupRaw, ["user_id"])
})
.ws("/ws", {
    query: groupProfileSchema.wsConfig,
    
    async open(ws) {
        try {
            const groupId = ws.data.query.group_id;
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ message: "you are not allowed to access", type: "error" }));
                ws.close(4001, "you are not allowed to access");
                return;
            }

            const userId = session.user.id;

            if (!userId || !groupId || typeof userId !== "string" || typeof groupId !== "string") {
                ws.send(JSON.stringify({ message: "invalid group or user", type: "error" }));
                ws.close(4002, "invalid group or user");
                return;
            }

            const room1 = `group-profile-${groupId}`;
            const room2 = `joined-group-${userId}`;

            const handler = (data: any) => ws.send(JSON.stringify(data));

            const subscriptions: TGroupProfile["wsSubscription"][] = [
                { room_name: room1, room_handler: handler }, 
                { room_name: room2, room_handler: handler }
            ]

            subscriptions.forEach((subscription) => {
                groupProfileEvent.on(subscription.room_name, subscription.room_handler);
            });

            wsContext.set(ws, subscriptions);
        } catch (error) {
            ws.send(JSON.stringify({ message: "internal error", type: "error" }));
            ws.close(4003, "internal error");
        }
    },

    close(ws) {
        const subscriptions = wsContext.get(ws);
            
        if (subscriptions) {
            subscriptions.forEach((subscription) => {
                groupProfileEvent.off(subscription.room_name, subscription.room_handler);
            });
            wsContext.delete(ws);
        }
    }
});

export default groupProfileRouters;