import Elysia from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";

const userProfileRouters = new Elysia({ prefix: "/api/v1/users" })
.use(apiAuthMiddleware);

export default userProfileRouters;