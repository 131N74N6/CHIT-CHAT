import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearAllUserChatsForMe, 
    clearChosenUserChatsForMe, 
    deleteAllUserChats, 
    deleteChosenUsersChat, 
    editSelectedChat, 
    sendToOtherUser, 
    showAllChats,
    showAllMediaInClickedChat,
} from "../controllers/user_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const userChatsRouters = Router();

userChatsRouters.delete("/clear/:receiver_id", verifyToken, clearChosenUserChatsForMe);

userChatsRouters.delete("/clears/:receiver_id", verifyToken, clearAllUserChatsForMe);

userChatsRouters.delete("/rm-all/:receiver_id", verifyToken, deleteAllUserChats);

userChatsRouters.delete("/rm/:receiver_id", verifyToken, deleteChosenUsersChat);

userChatsRouters.get("/show-all/:receiver_id", verifyToken, showAllChats);

userChatsRouters.get("/show-all/media/:chat_id", verifyToken, showAllMediaInClickedChat);

userChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherUser);

userChatsRouters.put("/remake/:_id/:receiver_id", verifyToken, editSelectedChat);

export default userChatsRouters;