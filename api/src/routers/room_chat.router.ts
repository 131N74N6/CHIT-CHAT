import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearRoomChatForMe, 
    clearRoomChatsForMe, 
    deleteAllChatsInRoom, 
    deleteChatInRoom, 
    sendToOtherRoom, 
    showwAllChatsForRoom
} from "../controllers/room_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const roomChatsRouters = Router();

roomChatsRouters.delete("/clear/:_id/:room_id", verifyToken, clearRoomChatForMe);

roomChatsRouters.delete("/clears/:room_id", verifyToken, clearRoomChatsForMe)

roomChatsRouters.delete("/rm-all/:room_id", verifyToken, deleteAllChatsInRoom);

roomChatsRouters.delete("/rm/:_id/:room_id", verifyToken, deleteChatInRoom);

roomChatsRouters.get("/show-all/:room_id", verifyToken, showwAllChatsForRoom);

roomChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherRoom);

export default roomChatsRouters;