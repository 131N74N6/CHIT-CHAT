import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

export async function getAllUsers(req: AuthRequest, res: Response) {
    try {
        const searched = req.query.searched as string | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const userId = req.user?.user_id;
        let users;

        if (searched === undefined) {
            users = await User.find({ _id: { $ne: userId } }).limit(limit).skip(skip).sort({ username: 1 });
            
            res.status(200).json(users);
        } else {
            users = await User
            .find({ _id: { $ne: userId }, username: { $regex: new RegExp(searched, 'i') } })
            .limit(limit)
            .skip(skip)
            .sort({ username: 1 });

            res.status(200).json(users);
        }
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getCurrentUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.findOne({ _id: req.user?.user_id });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({
            address: user.address,
            created_at: user.created_at,
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