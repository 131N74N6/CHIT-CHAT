import { Request, Response } from "express";
import { Chats } from "../models/chat.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { User } from "../models/user.model";

export async function showAllChats(req: AuthRequest, res: Response) {
    try {
        const receiverId = req.params.receiver_id;
        const senderId = req.user?.user_id;

        const limit = parseInt(req.query.limit as string) || 13;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const chats = await Chats
        .find({ receiver_id: receiverId, sender_id: senderId, hidden_for: { $nin: [senderId!] } })
        .limit(limit)
        .skip(skip);

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showReceiverProfile(req: Request, res: Response) {
    try {
        const receiverIdParams = req.params.receiver_id;
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;

        const receiver = await User.findOne({ _id: receiverId });
        if (!receiver) return res.status(404).json({ message: "user not found" });

        res.status(200).json({
            address: receiver.address,
            gender: receiver.gender,
            profile_picture: receiver.profile_picture,
            user_id: receiver._id,
            username: receiver.username
        });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}