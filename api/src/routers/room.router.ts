import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { showAvailableRoom, showRoomMember } from "../views/room.view";
import { changeRoomName, createRoom, deleteRoom, kickMember } from "../controllers/room.controller";

const roomRouters = Router();

roomRouters.delete("/rm/:room_id", verifyToken, deleteRoom);

roomRouters.get("/show-all", verifyToken, showAvailableRoom);
roomRouters.get("/members/:room_id", verifyToken, showRoomMember);

roomRouters.post("/make", verifyToken, createRoom);

roomRouters.put("/remake/:room_id", verifyToken, changeRoomName);
roomRouters.put("/kick/:user_id", verifyToken, kickMember);

export default roomRouters;