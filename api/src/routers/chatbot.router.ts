import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { askAi, deleteAllChats, deleteChat, getAllResults, getResult } from "../controllers/chatbot.controller";

const chatBotRouters = Router();

chatBotRouters.delete("/rm-all", verifyToken, deleteAllChats);
chatBotRouters.delete("/rm/:_id", verifyToken, deleteChat);

chatBotRouters.get("/show-all", verifyToken, getAllResults);
chatBotRouters.get("/show/:_id", verifyToken, getResult);

chatBotRouters.post("/ask-ai", verifyToken, askAi);

export default chatBotRouters;