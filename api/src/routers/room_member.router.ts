import { Router } from "express";
import { kickMember, leftRoom, showRoomMember } from "../controllers/room_member.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const roomMembersRouters = Router();

roomMembersRouters.get("/show-all/:room_id", verifyToken, showRoomMember);

roomMembersRouters.put("/kick/:user_id", verifyToken, kickMember);

roomMembersRouters.put("/left-room/:room_id", verifyToken, leftRoom);

export default roomMembersRouters;