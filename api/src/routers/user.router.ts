import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../views/user.view";
import { changeRoom, changeUser, createRoom, deleteOldProfilePicture, deleteOldRoomProfile, deleteRoom, kickMember, leftRoom } from "../controllers/user.controller";
import { uploadImage } from "../middlewares/upload.middleware";

const userRouters = Router();

userRouters.delete("/rm", verifyToken, getCurrentUser);
userRouters.delete("/rm-pict", verifyToken, deleteOldProfilePicture);
userRouters.delete("/rm/:room_id", verifyToken, deleteRoom);
userRouters.delete("/rm-pict/:room_id", verifyToken, deleteOldRoomProfile);

userRouters.get("/show", verifyToken, getCurrentUser);
userRouters.post("/make-room", verifyToken, uploadImage, createRoom);

userRouters.put("/left-room/:room_id", verifyToken, leftRoom);
userRouters.put("/remake", verifyToken, uploadImage, changeUser);
userRouters.put("/remake/:room_id", verifyToken, uploadImage, changeRoom);
userRouters.put("/kick/:user_id", verifyToken, kickMember);

export default userRouters;