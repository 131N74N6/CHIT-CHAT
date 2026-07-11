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

        io.to(`room-chat:${newChat.room_id}`).emit("room-chat:send", {
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

export async function deleteAllChats(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const chats = await Chats.find({ sender_id: userId });
        const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.updateMany({ sender_id: userId }, {
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

export async function deleteAllChatsPermanentlyInRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const roomId = req.params.room_id;
        
        const chats = await Chats.find({ sender_id: userId, room_id: roomId });
        const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.deleteMany({ sender_id: userId, room_id: roomId })
        ]);

        io.to(`room-chat:${roomId}`).emit("room:deleted-all-chats-permanently", chats);

        res.status(200).json({ message: "all your message in group deleted permanently" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChatsInRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const roomId = req.params.room_id;

        const chats = await Chats.find({ sender_id: userId, room_id: roomId });
        const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

        const deleteFromCloudinary = selectedMedia.map(media => {
            return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
        });

        await Promise.all([
            ...deleteFromCloudinary,
            Chats.updateMany({ sender_id: userId, room_id: roomId }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            })
        ]);

        io.to(`room-chat:${roomId}`).emit("room:deleted-all-chat", chats);

        res.status(200).json({ message: "all your message in group deleted permanently" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChatPermanentlyInRoom(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const roomId = req.params.room_id;

        const chat = await Chats.findOne({ _id: id, room_id: roomId });
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

        io.to(`room-chat:${chat.room_id}`)
        .emit("room:chat-deleted-permanently", {
            _id: chat._id,
            created_at: chat.created_at,
            media: chat.media,
            messages: chat.messages
        });

        res.status(200).json({ message: "chat deleted permanently from room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChatInRoom(req: Request, res: Response) {
    try {
        const id = req.params._id;
        const roomId = req.params.room_id;

        const chat = await Chats.findOne({ _id: id, room_id: roomId });
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
            Chats.deleteOne({ _id: id, room_id: roomId })
        ]);

        io.to(`room-chat:${chat.room_id}`)
        .emit("room:chat-deleted", {
            _id: chat._id,
            created_at: chat.created_at,
            media: chat.media,
            messages: chat.messages
        });

        res.status(200).json({ message: "chat deleted from room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}