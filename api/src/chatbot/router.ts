import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import chatBotController from "./controller";
import { chatBotSchema } from "./model";

const chatBotRouters = new Elysia({ prefix: "/api/v1/chatbots" })
.use(apiAuthMiddleware)
.delete("/", async (ctx) => {
    return await chatBotController.deleteAllMessages(ctx.user.id);
})
.get("/", async (ctx) => {
    return await chatBotController.showAllChatBotResults({ user_id: ctx.user.id, ...ctx.query });
}, {
    query: t.Omit(chatBotSchema.filter, ["user_id"])
})
.post("/", async (ctx) => {
    return await chatBotController.sendQuestion({ user_id: ctx.user.id, ...ctx.body });
}, {
    body: t.Omit(chatBotSchema.questionAndAnswer, ["user_id"])
});

export default chatBotRouters;