import { AuthRequest } from "../middlewares/auth.middleware";
import { io } from "../services/socket_io.service";
import { Request, Response } from "express";
import { User } from "../models/user.model";

export async function kickMember(req: Request, res: Response) {
    try {
        const userId = req.params.user_id;
        const roomId = req.params.room_id;

        const updated = await User.findOneAndUpdate({ _id: userId }, {
            $pull: { room_id: roomId }
        });

        io.to(`room-chat:${roomId}`)
        .to(`room-member:${roomId}`)
        .to(`available-room:${userId}`)
        .emit("room:member-kicked", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "1 member kicked" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function leftRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const roomId = req.params.room_id;

        const updated = await User.findOneAndUpdate({ _id: userId }, {
            $pull: { room_id: roomId }
        });

        io.to(`room-member:${roomId}`)
        .to(`available-room:${userId}`)
        .emit("user:left-room-successfully", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "you left the room" });
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