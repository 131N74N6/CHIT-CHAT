import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { io } from "../services/socket-io.service";

export async function sendToOtherUser(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        const created_at = new Date().toISOString();
        const selectedMedia: CloudinaryUploadResult[] = [];

        const media = req.files as Express.Multer.File[] | undefined;
        const { messages, receiver_id } = req.body;

        if (!messages || !media) return res.status(400).json({ message: "please provide messages" });

        if (media && media.length > 0) {
            for (let x = 0; x < media.length; x++) {
                const cloudinary = await uploadTOCloudinary({ 
                    file_buffer: media[x].buffer,
                    folder_name: "chat_media",
                    original_name: media[x].filename
                });

                selectedMedia.push(cloudinary);
            }
        }

        const newChat = new Chats({
            created_at: created_at,
            messages: messages || null,
            media: selectedMedia || [],
            receiver_id: receiver_id,
            sender_id: user_id
        });

        await newChat.save();

        io.to(`receiver:${newChat.receiver_id}`).emit("chat:send-to-user", {
            _id: newChat._id,
            created_at: newChat.created_at,
            media: newChat.media,
            messages: newChat.messages,
            receiver_id: newChat.receiver_id,
            sender_id: newChat.sender_id
        });

        res.status(200).json({ message: "new chat for other user added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function sendToOtherRoom(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        const created_at = new Date().toISOString();
        const selectedMedia: CloudinaryUploadResult[] = [];

        const media = req.files as Express.Multer.File[] | undefined;
        const { messages, room_id } = req.body;

        if (!messages || !media) return res.status(400).json({ message: "please provide messages" });

        if (media && media.length > 0) {
            for (let x = 0; x < media.length; x++) {
                const cloudinary = await uploadTOCloudinary({ 
                    file_buffer: media[x].buffer,
                    folder_name: "chat_media",
                    original_name: media[x].filename
                });

                selectedMedia.push(cloudinary);
            }
        }

        const newChat = new Chats({
            created_at: created_at,
            messages: messages || null,
            media: selectedMedia || [],
            room_id: room_id,
            sender_id: user_id
        });

        await newChat.save();

        io.to(`room:${newChat.room_id}`).emit("chat:send-to-room", {
            _id: newChat._id,
            created_at: newChat.created_at,
            media: newChat.media,
            messages: newChat.messages,
            room_id: newChat.room_id,
            sender_id: newChat.sender_id
        });

        res.status(200).json({ message: "new chat for room only added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChats(req: Request, res: Response) {
    try {
        const receiver_id = req.params.receiver_id;
        const selectedMedia: CloudinaryUploadResult[] = [];
        const chats = await Chats.find({ receiver_id });

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

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
            Chats.updateMany({ receiver_id }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            })
        ]);

        res.status(200).json({ message: "all chats deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChatsPermanently(req: Request, res: Response) {
    try {
        const receiverId = req.params.receiver_id;
        const selectedMedia: CloudinaryUploadResult[] = [];
        const chats = await Chats.find({ receiver_id: receiverId });

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

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
            Chats.deleteMany({ receiver_id: receiverId })
        ]);
        res.status(200).json({ message: "all chats deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChat(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const selectedMedia: CloudinaryUploadResult[] = [];
        const chat = await Chats.findOne({ _id: id });
        if (!chat) return res.status(404).json({ message: "chat not found" });

        if (chat.media.length > 0) {
            chat.media.forEach(cmd => selectedMedia.push(cmd));
        }

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.updateOne({ _id: id }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            })
        ]);

        res.status(200).json({ message: "chat deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChatPermanently(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const selectedMedia: CloudinaryUploadResult[] = [];
        const chat = await Chats.findOne({ _id: id });
        if (!chat) return res.status(404).json({ message: "chat not found" });

        if (chat.media.length > 0) {
            chat.media.forEach(md => selectedMedia.push(md));
        }

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.deleteOne({ _id: id })
        ]);

        res.status(200).json({ message: "chat deleted permanently" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}