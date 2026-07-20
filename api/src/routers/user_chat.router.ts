import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearAllUserChatsForMe, 
    clearChosenUserChatsForMe, 
    deleteAllUserChats, 
    deleteChosenUsersChat, 
    sendToOtherUser, 
    showAllChats,
} from "../controllers/user_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const userChatsRouters = Router();

userChatsRouters.delete("/clear/:receiver_id", verifyToken, clearChosenUserChatsForMe);

userChatsRouters.delete("/clears/:receiver_id", verifyToken, clearAllUserChatsForMe);

userChatsRouters.delete("/rm-all", verifyToken, deleteAllUserChats);

userChatsRouters.delete("/rm/:receiver_id", verifyToken, deleteChosenUsersChat);

userChatsRouters.get("/show-all/:receiver_id", verifyToken, showAllChats);

userChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherUser);

export default userChatsRouters;