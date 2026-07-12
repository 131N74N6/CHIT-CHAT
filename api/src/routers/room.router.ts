import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getAllChatsForRoom, showAvailableRoom, showRoomMember } from "../views/room.view";
import { 
    clearChatInRoomForMe, 
    clearChatsInRoomForMe, 
    deleteAllChatsInRoom, 
    deleteAllChatsPermanentlyInRoom, 
    deleteChatInRoom, 
    deleteChatPermanentlyInRoom, 
    sendToOtherRoom 
} from "../controllers/room.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const roomRouters = Router();

roomRouters.delete("/rm-all/permanently/:room_id", verifyToken, deleteAllChatsPermanentlyInRoom);
roomRouters.delete("/rm/permanently/:_id/:room_id", verifyToken, deleteChatPermanentlyInRoom);
roomRouters.delete("/rm-all/:room_id", verifyToken, deleteAllChatsInRoom);
roomRouters.delete("/rm/:_id/:room_id", verifyToken, deleteChatInRoom);

roomRouters.get("/show-all", verifyToken, showAvailableRoom);
roomRouters.get("/members/:room_id", verifyToken, showRoomMember);
roomRouters.get("/chat/:room_id", verifyToken, getAllChatsForRoom);

roomRouters.post("/to-room", verifyToken, uploadMedia, sendToOtherRoom);

roomRouters.put("/clear/:_id/:room_id", verifyToken, clearChatInRoomForMe);
roomRouters.put("/clears/:room_id", verifyToken, clearChatsInRoomForMe)

export default roomRouters;