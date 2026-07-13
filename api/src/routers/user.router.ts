import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getAllUsers, getCurrentUser } from "../views/user.view";
import { 
    changeRoom, 
    changeUser, 
    createRoom, 
    deleteOldProfilePicture, 
    deleteOldRoomProfile, 
    deleteRoom, 
    deleteUser, 
    kickMember, 
    leftRoom 
} from "../controllers/user.controller";
import { uploadImage } from "../middlewares/upload.middleware";

const userRouters = Router();

userRouters.delete("/rm", verifyToken, deleteUser);
userRouters.delete("/rm-pict", verifyToken, deleteOldProfilePicture);
userRouters.delete("/rm-room/:room_id", verifyToken, deleteRoom);
userRouters.delete("/rm-room-pict/:room_id", verifyToken, deleteOldRoomProfile);

userRouters.get("/show", verifyToken, getCurrentUser);
userRouters.get("/show-all", verifyToken, getAllUsers);

userRouters.post("/make-room", verifyToken, uploadImage, createRoom);

userRouters.put("/kick/:user_id", verifyToken, kickMember);
userRouters.put("/left-room/:room_id", verifyToken, leftRoom);
userRouters.put("/remake", verifyToken, uploadImage, changeUser);
userRouters.put("/remake-room/:room_id", verifyToken, uploadImage, changeRoom);

export default userRouters;