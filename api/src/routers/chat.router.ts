import { Router } from "express";
import { showAllChats, showReceiverProfile } from "../views/chat.view";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearChatForMe, 
    clearChatsForMe, 
    deleteAllChats, 
    deleteAllChatsPermanently, 
    deleteChat, 
    deleteChatPermanently, 
    sendToOtherUser 
} from "../controllers/chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const chatsRouters = Router();

chatsRouters.delete("/rm-all/permanently", verifyToken, deleteAllChatsPermanently);
chatsRouters.delete("/rm/permanently/:_id", verifyToken, deleteChatPermanently);
chatsRouters.delete("/rm-all", verifyToken, deleteAllChats);
chatsRouters.delete("/rm/:_id", verifyToken, deleteChat);

chatsRouters.get("/show-all/:receiver_id", verifyToken, showAllChats);
chatsRouters.get("/profile/:receiver_id", verifyToken, showReceiverProfile);

chatsRouters.post("/to-user", verifyToken, uploadMedia, sendToOtherUser);

chatsRouters.put("/clear/:_id", verifyToken, clearChatForMe);
chatsRouters.put("/clears/:receiver_id", verifyToken, clearChatsForMe);

export default chatsRouters;