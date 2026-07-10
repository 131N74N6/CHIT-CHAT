import { Request, Response } from "express";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Rooms } from "../models/room.model";

export async function showAvailableRoom(req: AuthRequest, res: Response) {
    try {
        const room = await Rooms.find();
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showRoomMember(req: Request, res: Response) {
    try {
        const roomId = req.params.room_id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 14;
        const skip = (page - 1) * limit;

        const member = await User.find({ room_id: roomId }).limit(limit).skip(skip);
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}