import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearUserChatForMe, 
    clearUserChatsForMe, 
    deleteAllUserChats, 
    deleteUserChat, 
    sendToOtherUser, 
    showAllChats,
} from "../controllers/user_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const userChatsRouters = Router();

userChatsRouters.delete("/clear/:receiver_id", verifyToken, clearUserChatForMe);

userChatsRouters.delete("/clears/:receiver_id", verifyToken, clearUserChatsForMe);

userChatsRouters.delete("/rm-all", verifyToken, deleteAllUserChats);

userChatsRouters.delete("/rm/:_id", verifyToken, deleteUserChat);

userChatsRouters.get("/show-all/:receiver_id", verifyToken, showAllChats);

userChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherUser);

export default userChatsRouters;