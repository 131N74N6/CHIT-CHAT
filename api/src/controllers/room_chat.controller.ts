import { Request, Response } from "express";
import { Chats } from "../models/chat.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middlewares/auth.middleware";
import { io } from "../services/socket_io.service";
import { User } from "../models/user.model";

export async function clearRoomChatForMe(req: AuthRequest, res: Response) {
    try {
        const id = req.params._id;
        const userId = req.user?.user_id;

        const roomIdParam = req.params.room_id;
        const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

        const member = await User.find({ room_id: { $in: [roomId] } });

        const chat = await Chats.findOne({ _id: id, room_id: roomId });
        if (!chat) return res.status(404).json({ message: "chat not found" });

        if (chat.hidden_for.length === member.length) {
            const selectedMedia: CloudinaryUploadResult[] = chat.media.map(media => media) || [];

            const deleteFromCloudinary = selectedMedia.map(media => {
                return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
            });

            await Promise.all([
                ...deleteFromCloudinary,,
                Chats.deleteOne({ _id: id, room_id: roomId })
            ]);

            io.to(`room-chat:${chat.room_id}`)
            .emit("room-chat:deleted-permanently", {
                _id: chat._id,
                created_at: chat.created_at,
                media: chat.media,
                messages: chat.messages
            });
        } else {
            await Chats.updateOne({ _id: id, room_id: roomId }, {
                $set: { media: [] },
                $addToSet: { hidden_for: userId }
            });
        }

        res.status(200).json({ message: "chat in room cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function clearRoomChatsForMe(req: AuthRequest, res: Response) {
    try {
        const roomIdParam = req.params.room_id;
        const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
        const userId = req.user?.user_id;

        const member = await User.find({ room_id: { $in: [roomId] } });

        const chats = await Chats.find({ room_id: roomId, hidden_for: { $nin: [userId!] } });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        chats.forEach(async (chat) => {
            if (chat.hidden_for.length === member.length) {
                const selectedMedia: CloudinaryUploadResult[] = chats.flatMap(chat => chat.media || []);

                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });

                await Promise.all([
                    ...deleteFromCloudinary,
                    Chats.deleteMany({ sender_id: userId, room_id: roomId })
                ]);

                io.to(`room-chat:${roomId}`).emit("room-chat:all-deleted-permanently", {
                    _id: chat._id,
                    media: chat.media,
                    messages: chat.messages
                });
            } else {
                await Chats.updateMany({ room_id: roomId }, {
                    $set: { media: [] },
                    $addToSet: { hidden_for: userId }
                });
            }
        });

        res.status(200).json({ message: "all chats in room cleared" });
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

        io.to(`room-chat:${roomId}`).emit("room-chat:all-deleted", chats);

        res.status(200).json({ message: "all your message in group deleted permanently" });
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
            Chats.updateOne({ _id: id }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            })
        ]);

        io.to(`room-chat:${chat.room_id}`)
        .emit("room-chat:deleted", {
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

        io.to(`room-chat:${newChat.room_id}`).emit("room-chat:send-new-chat", {
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

export async function showwAllChatsForRoom(req: AuthRequest, res: Response) {
    try {
        const roomId = req.params.room_id;
        const userId = req.user?.user_id;

        const limit = parseInt(req.query.limit as string) || 14;
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