import { Router } from "express";
import { getAllChats, getAllChatsForRoom } from "../views/chat.view";
import { verifyToken } from "../middlewares/auth.middleware";
import { deleteAllChats, deleteAllChatsPermanently, deleteChat, deleteChatPermanently } from "../controllers/chat.controller";

const docsRouters = Router();

docsRouters.delete("/user/rm-all/:receiver_id", verifyToken, deleteAllChats);
docsRouters.delete("/user/rm-all-pr/:receiver_id", verifyToken, deleteAllChatsPermanently);

docsRouters.delete("/rm/:_id", verifyToken, deleteChat);
docsRouters.delete("/rm-p/:_id", verifyToken, deleteChatPermanently);

docsRouters.get("/user/:receiver_id", verifyToken, getAllChats);
docsRouters.get("/room/room_id", verifyToken, getAllChatsForRoom);

export default docsRouters;