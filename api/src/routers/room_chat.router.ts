import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearChatInRoomForMe, 
    clearChatsInRoomForMe, 
    deleteAllChatsInRoom, 
    deleteAllChatsPermanentlyInRoom, 
    deleteChatInRoom, 
    deleteChatPermanentlyInRoom, 
    sendToOtherRoom, 
    showwAllChatsForRoom
} from "../controllers/room_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const roomChatsRouters = Router();

roomChatsRouters.delete("/rm-all/permanently/:room_id", verifyToken, deleteAllChatsPermanentlyInRoom);
roomChatsRouters.delete("/rm/permanently/:_id/:room_id", verifyToken, deleteChatPermanentlyInRoom);
roomChatsRouters.delete("/rm-all/:room_id", verifyToken, deleteAllChatsInRoom);
roomChatsRouters.delete("/rm/:_id/:room_id", verifyToken, deleteChatInRoom);

roomChatsRouters.get("/show-all/:room_id", verifyToken, showwAllChatsForRoom);

roomChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherRoom);

roomChatsRouters.put("/clear/:_id/:room_id", verifyToken, clearChatInRoomForMe);
roomChatsRouters.put("/clears/:room_id", verifyToken, clearChatsInRoomForMe)

export default roomChatsRouters;