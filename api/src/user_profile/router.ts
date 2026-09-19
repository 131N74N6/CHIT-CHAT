import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import userProfileController from "./controller";
import { userProfileSchema } from "./model";

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
    return await userProfileController.showUser({ id: context.user.id });
})
.put("/", async (context) => {
    return await userProfileController.changeUser({ id: context.user.id, ...context.body });
}, {
    body: t.Omit(userProfileSchema.changeRaw, ["id"])
});

export default userProfileRouters;