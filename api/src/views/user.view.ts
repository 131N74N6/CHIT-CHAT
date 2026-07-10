import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

export async function getCurrentUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.findOne({ _id: req.user?.user_id });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({
            address: user.address,
            email: user.email,
            gender: user.gender,
            profile_pic: user.profile_picture,
            user_id: user._id,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}