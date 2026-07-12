import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { io } from "../services/socket-io.service";

export async function clearChatForMe(req: AuthRequest, res: Response) {
    try {
        const id = req.params._id;
        const userId = req.user?.user_id;

        const chat = await Chats.findOne({ _id: id });
        if (!chat) return res.status(404).json({ message: "chat not found" });

        await Chats.updateOne({ _id: id }, {
            $set: { media: [] },
            $addToSet: { hidden_for: userId }
        });

        res.status(200).json({ message: "chat cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function clearChatsForMe(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const receiverId = req.params.receiver_id;
        const chats = await Chats.find({ receiver_id: receiverId, sender_id: userId });

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        await Chats.updateMany({ sender_id: userId, receiver_id: receiverId }, {
            $set: { media: [] },
            $addToSet: { hidden_for: userId }
        });

        res.status(200).json({ message: "all chats cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChats(req: AuthRequest, res: Response) {
    try {
        const senderId = req.user?.user_id;

        const chats = await Chats.find({ sender_id: senderId });
        const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.updateMany({ sender_id: senderId }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            })
        ]);

        io.to(`receiver:${chats[0].receiver_id}`).emit("chat:all-deleted", chats);

        res.status(200).json({ message: "all chats deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChatsPermanently(req: AuthRequest, res: Response) {
    try {
        const senderId = req.user?.user_id;
        const chats = await Chats.find({ sender_id: senderId });
        const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.deleteMany({ sender_id: senderId })
        ]);

        io.to(`receiver:${chats[0].receiver_id}`).emit("chat:all-deleted-permanently", chats);

        res.status(200).json({ message: "all chats deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChat(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const chat = await Chats.findOne({ _id: id });

        if (!chat) return res.status(404).json({ message: "chat not found" });
        const selectedMedia: CloudinaryUploadResult[] = chat.media.map(media => media) || [];

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

        io.to(`receiver:${chat.receiver_id}`)
        .emit("chat:deleted", {
            _id: chat._id,
            created_at: chat.created_at,
            media: chat.media,
            messages: chat.messages
        });

        res.status(200).json({ message: "chat deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChatPermanently(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const chat = await Chats.findOne({ _id: id });

        if (!chat) return res.status(404).json({ message: "chat not found" });
        const selectedMedia: CloudinaryUploadResult[] = chat.media.map(media => media) || [];

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

        io.to(`receiver:${chat.receiver_id}`)
        .emit("chat:deleted-permanently", {
            _id: chat._id,
            created_at: chat.created_at,
            media: chat.media,
            messages: chat.messages
        });

        res.status(200).json({ message: "chat deleted permanently" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

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

        io.to(`receiver:${newChat.receiver_id}`).emit("chat:send", {
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