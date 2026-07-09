import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Docs } from "../models/doc.model";
import { User } from "../models/user.model";

export async function changeUser(req: AuthRequest, res: Response) {
    try {
        const { address, gender, username } = req.body;
        const currentUserId = req.user?.user_id;
        await User.updateOne({ _id: currentUserId }, {
            $set: {
                address: address || "-",
                gender: gender,
                username: username || `user-${Date.now()}`
            }
        });

        res.status(200).json({ message: "user profile updated" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteUser(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        await Promise.all([
            Docs.deleteMany({ user_id: currentUserId }),
            User.deleteOne({ _id: currentUserId })
        ]);

        res.status(200).json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}