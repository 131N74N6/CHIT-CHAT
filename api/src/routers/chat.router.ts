import { Router } from "express";
import { getAllChats, getAllChatsForRoom } from "../views/chat.view";
import { verifyToken } from "../middlewares/auth.middleware";
import { deleteAllChats, deleteAllChatsPermanently, deleteChat, deleteChatPermanently, deleteAllChatsInRoom, deleteAllChatsPermanentlyInRoom, deleteChatInRoom, deleteChatPermanentlyInRoom, sendToOtherUser, sendToOtherRoom } from "../controllers/chat.controller";

const chatsRouters = Router();

chatsRouters.delete("/user/rm-all/permanently", verifyToken, deleteAllChatsPermanently);
chatsRouters.delete("/user/rm/permanently/:_id", verifyToken, deleteChatPermanently);
chatsRouters.delete("/user/rm-all", verifyToken, deleteAllChats);
chatsRouters.delete("/user/rm/:_id", verifyToken, deleteChat);

chatsRouters.delete("/room/rm-all/permanently/:room_id", verifyToken, deleteAllChatsPermanentlyInRoom);
chatsRouters.delete("/room/rm/permanently/:_id/:room_id", verifyToken, deleteChatPermanentlyInRoom);
chatsRouters.delete("/room/rm-all/:room_id", verifyToken, deleteAllChatsInRoom);
chatsRouters.delete("/room/rm/:_id/:room_id", verifyToken, deleteChatInRoom);

chatsRouters.get("/user/:receiver_id", verifyToken, getAllChats);
chatsRouters.get("/room/room_id", verifyToken, getAllChatsForRoom);

chatsRouters.post("/to-user", verifyToken, sendToOtherUser);
chatsRouters.post("/to-room", verifyToken, sendToOtherRoom);

export default chatsRouters;