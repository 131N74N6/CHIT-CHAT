import { Router } from "express";
import { getAllChats, getAllChatsForRoom } from "../views/chat.view";
import { verifyToken } from "../middlewares/auth.middleware";
import { deleteAllChats, deleteAllChatsPermanently, deleteChat, deleteChatPermanently } from "../controllers/chat.controller";

const chatsRouters = Router();

chatsRouters.delete("/user/rm-all/:receiver_id", verifyToken, deleteAllChats);
chatsRouters.delete("/user/rm-all-pr/:receiver_id", verifyToken, deleteAllChatsPermanently);

chatsRouters.delete("/rm/:_id", verifyToken, deleteChat);
chatsRouters.delete("/rm-p/:_id", verifyToken, deleteChatPermanently);

chatsRouters.get("/user/:receiver_id", verifyToken, getAllChats);
chatsRouters.get("/room/room_id", verifyToken, getAllChatsForRoom);

export default chatsRouters;