import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../views/user.view";
import { changeUser, deleteOldProfile, leftRoom } from "../controllers/user.controller";
import { uploadImage } from "../middlewares/profile-img.middleware";

const userRouters = Router();

userRouters.delete("/rm", verifyToken, getCurrentUser);
userRouters.delete("/rm-pict", verifyToken, deleteOldProfile);

userRouters.get("/show", verifyToken, getCurrentUser);

userRouters.put("/left-room/:room_id", verifyToken, leftRoom);
userRouters.put("/remake", verifyToken, uploadImage, changeUser);

export default userRouters;