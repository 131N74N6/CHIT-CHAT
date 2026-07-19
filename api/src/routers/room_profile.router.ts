import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/upload.middleware";
import { 
    changeRoom, 
    createRoom, 
    deleteOldRoomProfile, 
    deleteRoom, 
    showAvailableRoom, 
    showRoomProfile 
} from "../controllers/room_profile.controller";

const roomProfileRouters = Router();

roomProfileRouters.delete("/rm/:room_id", verifyToken, deleteRoom);
roomProfileRouters.delete("/rm-pict/:room_id", verifyToken, deleteOldRoomProfile);

roomProfileRouters.get("/show-all", verifyToken, showAvailableRoom);
roomProfileRouters.get("/show/:room_id", verifyToken, showRoomProfile);

roomProfileRouters.post("/make-room", verifyToken, uploadImage, createRoom);

roomProfileRouters.put("/remake/:room_id", verifyToken, uploadImage, changeRoom);

export default roomProfileRouters;