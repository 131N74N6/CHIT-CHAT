import Elysia from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";

const groupProfileRouters = new Elysia({ prefix: "/api/v1/groups" })
.use(apiAuthMiddleware)
.delete("/", async () => {}, {})
.get("/", async () => {}, {})
.get("/", async () => {}, {})
.post("/", async () => {}, {})
.put("/", async () => {}, {})
.ws("/ws", {});

export default groupProfileRouters;