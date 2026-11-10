import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import userProfileController from "./controller";
import { userProfileSchema } from "./model";
import { createAuthErrorStream, createUserSSEStream, SSE_HEADERS } from "./sse";
import { authServiceApi } from "../auth/service";

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
.get("/sse", async ({ request }) => {
    const session = await authServiceApi.api.getSession({ headers: request.headers });
    if (!session) return new Response(createAuthErrorStream(), { headers: SSE_HEADERS });

    const stream = createUserSSEStream(session.user.id);
    return new Response(stream, { headers: SSE_HEADERS });
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
});

export default userProfileRouters;