import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import userProfileController from "./controller";
import { userProfileSchema } from "./model";
import { validateSession } from "../auth/service";
import { userProfileEvent } from "./event";

const wsContext = new WeakMap<any, { room: string; handler: (data: any) => void }[]>();

const userProfileRouters = new Elysia({ prefix: "/api/v1/users" })
.use(apiAuthMiddleware)
.delete("/", async (context) => {
    return await userProfileController.deleteUser(context.user.id);
})
.get("/all", async (context) => {
    return await userProfileController.showAllUsers(context.query);
}, {
    query: userProfileSchema.showAllUser
})
.get("/", async (context) => {
    return await userProfileController.showUser({ id: context.query.id });
}, {
    query: userProfileSchema.showUser
})
.get("/session", async (context) => {
    const token = context.cookie['better-auth.session_token'].value;
    return { data: token };
})
.put("/", async (context) => {
    return await userProfileController.changeUser({ id: context.user.id, ...context.body });
}, {
    body: t.Omit(userProfileSchema.changeRaw, ["id"])
})
.put("/:id", async (context) => {
    return await userProfileController.deleteUserProfilePicture(context.params.id);
}, {
    params: t.Pick(userProfileSchema.changeRaw, ["id"])
}).ws("/ws", {
    async open (ws) {
        try {
            const token = ws.data.query.token;
            const session = await validateSession(token);

            if (!session || !session.user) {
                ws.send(JSON.stringify({ message: "You are not allowed to access", type: "error" }));
                ws.close(4001, "You are not allowed to access");
                return;
            }

            const userId = session.user.id;

            if (!userId || typeof userId !== "string") {
                ws.send(JSON.stringify({ message: "Invalid user", type: "error" }));
                ws.close(4002, "Invalid user");
                return;
            }

            const availableRoom = `available-user-${userId}`;
            const currentUserProfileRoom = `current-user-profile-${userId}`;
            const handler = (data: any) => ws.send(JSON.stringify(data));

            const subscriptions = [
                { room: availableRoom, handler: handler }, 
                { room: currentUserProfileRoom, handler: handler }
            ];

            subscriptions.forEach((subscription) => {
                userProfileEvent.on(subscription.room, subscription.handler);
            });

            wsContext.set(ws, subscriptions);
        } catch (error) {
            ws.send(JSON.stringify({ message: "Something went wrong", type: "error" }));
            ws.close(4003, "Internal error");
        }
    },
    close: (ws) => {
        const subscriptions = wsContext.get(ws);
        if (subscriptions) {
            subscriptions.forEach((subscription) => {
                userProfileEvent.off(subscription.room, subscription.handler);
            });
            wsContext.delete(ws)
        }
    },
    query: userProfileSchema.waConfig
});

export default userProfileRouters;