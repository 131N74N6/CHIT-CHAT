import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { User } from "../models/user.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { Rooms } from "../models/room.model";
import { Types } from "mongoose";
import { io } from "../services/socket_io.service";

export async function changeUser(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        const { address, gender, username } = req.body;
        const selectedImage: Express.Multer.File | undefined = req.file;

        let newProfilePicture;
        const user = await User.findOne({ _id: currentUserId });
        if (!user) return res.status(404).json({ message: "user not found" });

        if (selectedImage) {
            if (user.profile_picture && user.profile_picture.public_id) {
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
                profile_picture: newProfilePicture || user.profile_picture,
                username: username || user.username
            }
        }, { new: true });

        if (user.room_id.length > 0 && user.room_id) {
            user.room_id.forEach(roomId => {
                io.to(`room-chat:${roomId}`)
                .to(`room-member:${roomId}`)
                .emit("user-profile:changed", {
                    _id: updated?._id,
                    profile_picture: updated?.profile_picture,
                    username: username
                });
            });
        }

        io.to(`available-user:${updated?._id}`)
        .to(`user-profile:${currentUserId}`)
        .emit("user-profile:changed", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: username
        });

        res.status(200).json({ message: "user profile updated" });
    } catch (error) {
        console.log(error);
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
            io.to(`room-chat:${roomId}`)
            .to(`room-member:${roomId}`)
            .emit("user:deleted", {
                _id: user._id,
                profile_picture: user.profile_picture,
                username: user.username
            });
        });

        io.to(`user-chat:${user._id}`)
        .to(`user-profile:${user._id}`)
        .to(`available-user:${user._id}`)
        .emit("user:deleted", {
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

        io.to(`room-member:${room_code}`)
        .to(`available-room:${userId}`)
        .emit("user:join-room-successfully", {
            _id: updated?._id,
            profile_picture: updated?.profile_picture,
            username: updated?.username
        });

        res.status(200).json({ message: "you left the room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showAllUsers(req: AuthRequest, res: Response) {
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

export async function showCurrentUser(req: AuthRequest, res: Response) {
    try {
        const user = await User.findOne({ _id: req.user?.user_id });
        if (!user) return res.status(404).json({ message: "user not found" });
        res.status(200).json({
            address: user.address,
            created_at: user.created_at,
            email: user.email,
            gender: user.gender,
            profile_picture: user.profile_picture,
            user_id: user._id,
            username: user.username
        });
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
            created_at: receiver.created_at,
            gender: receiver.gender,
            profile_picture: receiver.profile_picture,
            user_id: receiver._id,
            username: receiver.username
        });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}