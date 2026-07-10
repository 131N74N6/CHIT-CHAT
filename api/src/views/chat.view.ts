import { Request, Response } from "express";
import { Chats } from "../models/chat.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export async function getAllChats(req: AuthRequest, res: Response) {
    try {
        const receiverId = req.params.receiver_id;
        const senderId = req.user?.user_id;

        const limit = parseInt(req.query.limit as string) || 13;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const chats = await Chats.find({ receiver_id: receiverId, sender_id: senderId }).limit(limit).skip(skip);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function getAllChatsForRoom(req: Request, res: Response) {
    try {
        const roomId = req.params.room_id;
        const limit = parseInt(req.query.limit as string) || 13;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const chats = await Chats.find({ room_id: roomId }).limit(limit).skip(skip);
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}