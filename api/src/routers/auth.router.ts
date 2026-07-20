import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller";

const authRouters = Router();

authRouters.post("/signin", signIn);

authRouters.post("/signout", signOut);

authRouters.post("/signup", signUp);

export default authRouters;