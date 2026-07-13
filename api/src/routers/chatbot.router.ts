import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { askAi, deleteAllChats, deleteChat } from "../controllers/chatbot.controller";
import { getAllResults, getResult } from "../views/chatbot.view";

const chatBotRouters = Router();

chatBotRouters.delete("/rm-all", verifyToken, deleteAllChats);
chatBotRouters.delete("/rm/:_id", verifyToken, deleteChat);

chatBotRouters.get("/show-all", verifyToken, getAllResults);
chatBotRouters.get("/show/:_id", verifyToken, getResult);

chatBotRouters.post("/ask-ai", verifyToken, askAi);

export default chatBotRouters;