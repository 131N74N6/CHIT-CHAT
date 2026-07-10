import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { User } from "../models/user.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { Types } from "mongoose";
import { Rooms } from "../models/room.model";

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
        
        await User.updateOne({ _id: currentUserId }, {
            $set: {
                address: address || null,
                gender: gender || null,
                profile_picture: newProfilePicture || null,
                username: username || `user-${Date.now()}`
            }
        });

        res.status(200).json({ message: "user profile updated" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteOldProfile(req: AuthRequest, res: Response) {
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

        res.status(200).json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function joinRoom(req: AuthRequest, res: Response) {
    try {
        const { room_code } = req.body;
        const userId = req.user?.user_id;

        const currentUser = await User.findOne({ _id: userId });
        if (!currentUser) return res.status(404).json({ message: "user not found" });

        await User.updateOne({ _id: userId }, {
            $push: { room_id: new Types.ObjectId(room_code) },
        });

        res.status(200).json({ message: "you left the room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function leftRoom(req: AuthRequest, res: Response) {
    try {
        const currentUserId = req.user?.user_id;
        await User.updateOne({ _id: currentUserId }, {
            $set: { room_id: null }
        });

        res.status(200).json({ message: "you left the room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}