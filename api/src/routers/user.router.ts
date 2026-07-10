import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { getCurrentUser } from "../views/user.view";
import { changeUser, leftRoom } from "../controllers/user.controller";

const userRouters = Router();

userRouters.delete("/rm", verifyToken, getCurrentUser);

userRouters.get("/show", verifyToken, getCurrentUser);

userRouters.put("/left-room", verifyToken, leftRoom);
userRouters.put("/remake", verifyToken, changeUser);

export default userRouters;