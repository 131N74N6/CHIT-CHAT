import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Rooms } from "../models/room.model";
import { Chats } from "../models/chat.model";

export async function getAllChatsForRoom(req: AuthRequest, res: Response) {
    try {
        const roomId = req.params.room_id;
        const userId = req.user?.user_id;

        const limit = parseInt(req.query.limit as string) || 13;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const chats = await Chats
        .find({ room_id: roomId, hidden_for: { $nin: [userId!] } })
        .limit(limit)
        .skip(skip);

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showAvailableRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const currentUser = await User.findOne({ _id: userId });
        if (!currentUser) return res.status(404).json({ message: "user not found" });

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const rooms = await Rooms.find({ _id: { $in: currentUser.room_id } }).limit(limit).skip(skip);

        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showRoomMember(req: Request, res: Response) {
    try {
        const roomIdParam = req.params.room_id;
        const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const member = await User.find({ room_id: roomId }).limit(limit).skip(skip);
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}