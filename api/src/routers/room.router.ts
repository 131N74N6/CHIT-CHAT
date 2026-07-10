import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { showRoomChats, showRoomMember } from "../views/room.view";
import { changeRoomName, createRoom, deleteRoom, kickMember } from "../controllers/room.controller";

const roomRouters = Router();

roomRouters.delete("/rm/:room_id", verifyToken, deleteRoom);

roomRouters.get("/chats/:room_id", verifyToken, showRoomChats);
roomRouters.get("/members/:room_id", verifyToken, showRoomMember);

roomRouters.post("/make", verifyToken, createRoom);

roomRouters.put("/remake/:room_id", verifyToken, changeRoomName);
roomRouters.put("/kick/:user_id", verifyToken, kickMember);

export default roomRouters;