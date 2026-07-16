import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { User } from "../models/user.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { Types } from "mongoose";
import { Rooms } from "../models/room.model";
import { io } from "../services/socket_io.service";

export async function changeRoom(req: AuthRequest, res: Response) {
    try {
        const roomId = req.params.room_id;
        const userId = req.user?.user_id;
        
        const { description, name } = req.body;
        const selectedImage: Express.Multer.File | undefined = req.file;
        let newProfilePicture;

        if (!name) return res.status(400).json({ message: "room name is required" });

        const room = await Rooms.findOne({ _id: roomId });
        if (!room) return res.status(404).json({ message: "room not found" });

        const nameExist = await Rooms.findOne({ name: name, _id: { $ne: roomId } });
        if (nameExist) return res.status(409).json({ message: `name: ${name} has been taken` });

        if (selectedImage) {
            if (room.profile_picture !== null) {
                await v2.uploader.destroy(room.profile_picture.public_id, { resource_type: room.profile_picture.resource_type });

                const cloudinary = await uploadTOCloudinary({
                    file_buffer: selectedImage.buffer,
                    folder_name: "room_profile",
                    original_name: selectedImage.filename
                });

                newProfilePicture = cloudinary;
            }
        }

        const updated = await Rooms.findOneAndUpdate({ _id: roomId }, {
            $set: { 
                description: description || null,
                name: name, 
                profile_picture: newProfilePicture || null
            }
        });

        io.to(`room-profile:${updated?._id}`)
        .to(`room-chat:${updated?._id}`)
        .to(`available-room:${userId}`)
        .emit("room-profile:changed", {
            _id: updated?._id,
            description: updated?.description,
            name: updated?.name,
            profile_picture: updated?.profile_picture
        });

        res.status(200).json({ message: "room name changed" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function changeUser(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const { address, gender, username } = req.body;
        const selectedImage: Express.Multer.File | undefined = req.file;

        let newProfilePicture;
        const user = await User.findOne({ _id: currentUserId });
        if (!user) return res.status(404).json({ message: "user not found" });

        if (selectedImage) {
            if (user.profile_picture !== null) {
                await v2.uploader.destroy(user.profile_picture.public_id, { resource_type: user.profile_picture.resource_type });

                const cloudinary = await uploadTOCloudinary({
                    file_buffer: selectedImage.buffer,
                    folder_name: "user_profile",
                    original_name: selectedImage.filename
                });

                newProfilePicture = cloudinary;
            }
        }
        
        const updated = await User.findOneAndUpdate({ _id: currentUserId }, {
            $set: {
                address: address || null,
                gender: gender || null,
                profile_picture: newProfilePicture || null,
                username: username || `user-${Date.now()}`
            }
        });

        user.room_id.forEach(roomId => {
            io.to(`room:${roomId}`)
            .emit("user:changed", {
                _id: updated?._id,
                profile_picture: updated?.profile_picture,
                username: updated?.username
            });
        });

        io.to(`receiver:${updated?._id}`)
        .to(`receiver-profile:${updated?._id}`)
        .emit("user:changed", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "user profile updated" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function createRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const created_at = new Date().toISOString();

        const { description, name } = req.body;
        const selectedImage: Express.Multer.File | undefined = req.file;
        
        let picture;

        if (!name) return res.status(400).json({ message: "room name is required" });

        if (selectedImage) {
            const cloudinary = await uploadTOCloudinary({
                file_buffer: selectedImage.buffer,
                folder_name: "room_profile",
                original_name: selectedImage.filename
            });

            picture = cloudinary;
        }

        const newRoom = new Rooms({
            created_at: created_at,
            creator_id: userId,
            name: name,
            description: description || null,
            profile_picture: picture || null
        });

        await newRoom.save();
        await User.updateOne({ _id: userId }, { $addToSet: { room_id: newRoom._id } });

        res.status(200).json({ message: "new room created" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteOldProfilePicture(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const { old_image } = req.body;

        await Promise.all([
            v2.uploader.destroy(old_image.public_id, { resource_type: old_image.resource_type }),
            User.updateOne({ _id: userId }, { $set: { profile_picture: null } })
        ]);

        res.status(200).json({ message: "old picture deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteOldRoomProfile(req: Request, res: Response) {
    try {
        const roomId = req.params.room_id;
        const { old_image } = req.body;

        await Promise.all([
            v2.uploader.destroy(old_image.public_id, { resource_type: old_image.resource_type }),
            Rooms.updateOne({ _id: roomId }, { $set: { profile_picture: null } })
        ]);

        res.status(200).json({ message: "old picture deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteRoom(req: AuthRequest, res: Response) {
    try {
        const roomIdParam = req.params.room_id;
        const userId = req.user?.user_id;

        const roomIdStr = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
        const roomId = new Types.ObjectId(roomIdStr);

        const chats = await Chats.find({ room_id: roomIdStr });
        const room = await Rooms.findOne({ _id: roomId });
        const selectedMedia: CloudinaryUploadResult[] = [];

        if (!room) return res.status(404).json({ message: "room not found" });

        chats.forEach(chat => {
            if (chat.media.length > 0) {
                chat.media.forEach(media => selectedMedia.push(media));
            }
        });

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.deleteMany({ room_id: roomId }),
            User.updateMany({ room_id: roomId }, { $pull: { room_id: roomId } }),
            Rooms.deleteOne({ _id: roomId, creator_id: userId })
        ]);

        io.to(`room-chat:${roomId}`)
        .to(`room-profile:${roomId}`)
        .to(`available-room:${userId}`)
        .emit("room:deleted", {
            _id: room._id,
            name: room.name,
            profile_picture: room.profile_picture
        });

        io.to(`room-chat:${roomId}`).emit("room:deleted", chats);

        res.status(200).json({ message: "room deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteUser(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const selectedMedia: CloudinaryUploadResult[] = [];

        const chats = await Chats.find({ sender_id: currentUserId });
        const user = await User.findOne({ _id: currentUserId });
        if (!user) return res.status(404).json({ message: "user not found" });

        chats.forEach(chat => {
            if (chat.media.length > 0) {
                chat.media.forEach(media => selectedMedia.push(media));
            }
        });

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            v2.uploader.destroy(user.profile_picture.public_id, { resource_type: user.profile_picture.resource_type }),
            Rooms.deleteMany({ creator_id: currentUserId }),
            Chats.deleteMany({ sender_id: currentUserId }),
            User.deleteOne({ _id: currentUserId })
        ]);

        user.room_id.forEach(roomId => {
            io.to(`room-profile:${roomId}`)
            .emit("user:changed", {
                _id: user._id,
                profile_picture: user.profile_picture,
                username: user.username
            });
        });

        io.to(`receiver:${user._id}`)
        .emit("user:changed", {
            _id: user._id,
            profile_picture: user.profile_picture,
            username: user.username
        });

        res.status(200).json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function joinRoom(req: AuthRequest, res: Response) {
    try {
        const { room_code } = req.body;
        const userId = req.user?.user_id;

        const updated = await User.findOneAndUpdate({ _id: userId }, {
            $addToSet: { room_id: new Types.ObjectId(room_code) },
        });

        io.to(`room-profile:${room_code}`)
        .emit("user:joined", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "you left the room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function kickMember(req: Request, res: Response) {
    try {
        const userId = req.params.user_id;
        const roomId = req.params.room_id;

        const updated = await User.findOneAndUpdate({ _id: userId }, {
            $pull: { room_id: roomId }
        });

        io.to(`room-profile:${roomId}`)
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

        io.to(`room-profile:${roomId}`)
        .emit("user:left", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "you left the room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}