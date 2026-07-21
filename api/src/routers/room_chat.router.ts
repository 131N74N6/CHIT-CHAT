import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { 
    clearAllRoomChatsForMe, 
    clearChosenRoomChatsForMe, 
    deleteAllChatsInRoom, 
    deleteChosenChatsInRoom, 
    editSelectedChat, 
    sendToOtherRoom, 
    showwAllChatsForRoom
} from "../controllers/room_chat.controller";
import { uploadMedia } from "../middlewares/upload.middleware";

const roomChatsRouters = Router();

roomChatsRouters.delete("/clear/:room_id", verifyToken, clearChosenRoomChatsForMe);

roomChatsRouters.delete("/clears/:room_id", verifyToken, clearAllRoomChatsForMe)

roomChatsRouters.delete("/rm-all/:room_id", verifyToken, deleteAllChatsInRoom);

roomChatsRouters.delete("/rm/:room_id", verifyToken, deleteChosenChatsInRoom);

roomChatsRouters.get("/show-all/:room_id", verifyToken, showwAllChatsForRoom);

roomChatsRouters.post("/send", verifyToken, uploadMedia, sendToOtherRoom);

roomChatsRouters.put("/remake", verifyToken, editSelectedChat);

export default roomChatsRouters;