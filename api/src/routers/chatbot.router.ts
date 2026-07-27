import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { askAi, deleteAllChats, deleteChosenChats, showAllResults, showDetailResult } from "../controllers/chatbot.controller";

const chatBotRouters = Router();

chatBotRouters.delete("/rm-all", verifyToken, deleteAllChats);

chatBotRouters.delete("/rm-chosen", verifyToken, deleteChosenChats);

chatBotRouters.get("/show-all", verifyToken, showAllResults);

chatBotRouters.get("/show/:_id", verifyToken, showDetailResult);

chatBotRouters.post("/ask-ai", verifyToken, askAi);

export default chatBotRouters;