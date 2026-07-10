import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { showAvailableRoom, showRoomMember } from "../views/room.view";
import { changeRoomName, createRoom, deleteOldProfile, deleteRoom, kickMember } from "../controllers/room.controller";
import { uploadImage } from "../middlewares/profile-img.middleware";

const roomRouters = Router();

roomRouters.delete("/rm/:room_id", verifyToken, deleteRoom);
roomRouters.delete("/rm-pict/:room_id", verifyToken, deleteOldProfile);

roomRouters.get("/show-all", verifyToken, showAvailableRoom);
roomRouters.get("/members/:room_id", verifyToken, showRoomMember);

roomRouters.post("/make", verifyToken, uploadImage, createRoom);

roomRouters.put("/remake/:room_id", verifyToken, uploadImage, changeRoomName);
roomRouters.put("/kick/:user_id", verifyToken, kickMember);

export default roomRouters;