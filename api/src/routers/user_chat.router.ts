import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearChatForMe, 
    clearChatsForMe, 
    deleteAllChats, 
    deleteAllChatsPermanently, 
    deleteChat, 
    deleteChatPermanently, 
    sendToOtherUser, 
    showAllChats
} from "../controllers/user_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const userChatsRouters = Router();

userChatsRouters.delete("/rm-all/permanently", verifyToken, deleteAllChatsPermanently);
userChatsRouters.delete("/rm/permanently/:_id", verifyToken, deleteChatPermanently);
userChatsRouters.delete("/rm-all", verifyToken, deleteAllChats);
userChatsRouters.delete("/rm/:_id", verifyToken, deleteChat);

userChatsRouters.get("/show-all/:receiver_id", verifyToken, showAllChats);

userChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherUser);

userChatsRouters.put("/clear/:_id", verifyToken, clearChatForMe);
userChatsRouters.put("/clears/:receiver_id", verifyToken, clearChatsForMe);

export default userChatsRouters;