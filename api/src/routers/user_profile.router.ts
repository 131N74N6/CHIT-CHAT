import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/upload.middleware";
import { 
    changeUser, 
    deleteOldProfilePicture, 
    deleteUser, 
    joinRoom, 
    showCurrentUser, 
    showReceiverProfile 
} from "../controllers/user_profile.controller";
import { showAllUsers } from "../controllers/user_chat.controller";

const userProfileRouters = Router();

userProfileRouters.delete("/rm", verifyToken, deleteUser);
userProfileRouters.delete("/rm-pict", verifyToken, deleteOldProfilePicture);

userProfileRouters.get("/show", verifyToken, showCurrentUser);
userProfileRouters.get("/show-all", verifyToken, showAllUsers);
userProfileRouters.get("/other/:receiver_id", verifyToken, showReceiverProfile);

userProfileRouters.put("/join-room", verifyToken, joinRoom);
userProfileRouters.put("/remake", verifyToken, uploadImage, changeUser);

export default userProfileRouters;