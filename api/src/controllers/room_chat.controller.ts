import { Response } from "express";
import { Chats } from "../models/chat.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { AuthRequest } from "../middlewares/auth.middleware";
import { io } from "../services/socket_io.service";
import { User } from "../models/user.model";

export async function clearAllRoomChatsForMe(req: AuthRequest, res: Response) {
    try {
        const roomIdParam = req.params.room_id;
        const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;
        const userId = req.user?.user_id;

        const members = await User.find({ room_id: { $in: [roomId] } });
        const operations = [];

        const chats = await Chats.find({ room_id: roomId, hidden_for: { $nin: [userId!] } });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const toDeleteChatsPermanently = chats.filter(chat => chat.hidden_for.length + 1 === members.length);
        
        const selectedMedia: CloudinaryUploadResult[] = toDeleteChatsPermanently.flatMap(chat => chat.media || []);

        const toDeleteChats = chats.filter(chat => chat.hidden_for.length + 1 < members.length);

        if (toDeleteChatsPermanently.length > 0) {
            const toDeleteChatsPermanentlyIds = toDeleteChatsPermanently.map(chats => chats._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });

                operations.push(...deleteFromCloudinary);
            }

            operations.push(Chats.deleteMany({ _id: { $in: toDeleteChatsPermanentlyIds } }));
        } 
        
        if (toDeleteChats.length > 0) {
            const toDeleteChatsIds = toDeleteChats.map(chat => chat._id);

            operations.push(Chats.updateMany({ _id: { $in: toDeleteChatsIds }, room_id: roomId }, {
                $addToSet: { hidden_for: userId }
            }));
        }

        if (operations.length > 0) await Promise.all(operations);

        res.status(200).json({ message: "all chats in room cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function clearChosenRoomChatsForMe(req: AuthRequest, res: Response) {
    try {
        const ids = req.body.chatIds as string[];
        const userId = req.user?.user_id;

        const roomIdParam = req.params.room_id;
        const roomId = Array.isArray(roomIdParam) ? roomIdParam[0] : roomIdParam;

        const members = await User.find({ room_id: { $in: [roomId] } });
        const operations = [];

        const chats = await Chats.find({ _id: { $in: ids }, room_id: roomId });
        if (!chats) return res.status(404).json({ message: "chat not found" });

        const toDeleteChatsPermanently = chats.filter(chat => chat.hidden_for.length + 1 === members.length);
        
        const selectedMedia: CloudinaryUploadResult[] = toDeleteChatsPermanently.flatMap(chat => chat.media) || [];

        const toDeleteChats = chats.filter(chat => chat.hidden_for.length + 1 < members.length);

        if (toDeleteChatsPermanently.length > 0) {
            const toDeleteChatsPermanentlyIds = toDeleteChatsPermanently.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });

                operations.push(...deleteFromCloudinary);
            }

            operations.push(Chats.deleteMany({ _id: { $in: toDeleteChatsPermanentlyIds } }));
        } 

        if (toDeleteChats.length > 0) {
            const toDeleteChatsIds = toDeleteChats.map(chat => chat._id);

            await Chats.updateMany({ _id: { $in: toDeleteChatsIds }, room_id: roomId }, {
                $addToSet: { hidden_for: userId }
            });
        }

        res.status(200).json({ message: "chat in room cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllChatsInRoom(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const roomIdParams = req.params.room_id;
        const roomId = Array.isArray(roomIdParams) ? roomIdParams[0] : roomIdParams;
        const operations = []
        
        const members = await User.find({ room_id: { $in: [roomId] } });
        const chats = await Chats.find({ room_id: roomId });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const toDeleteOwnChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id.toString() === userId
        });

        const toDeleteOwnChats = chats.filter(chat => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id.toString() === userId
        });

        const toDeleteOtherChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id.toString() !== userId
        });

        const toDeleteOtherChats = chats.filter(chat => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id.toString() !== userId
        });


        if (toDeleteOwnChatsPermanent.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChatsPermanent.flatMap(chat => chat.media || []);
            const toDeleteOwnChatsPermanentIds = toDeleteOwnChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.deleteMany({ _id: { $in: toDeleteOwnChatsPermanentIds } }));
        }

        if (toDeleteOwnChats.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChats.flatMap(chat => chat.media || []);
            const toDeleteOwnChatsIds = toDeleteOwnChats.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.updateMany({ _id: { $in: toDeleteOwnChatsIds } }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            }));
    
            io.to(`room-chat:${roomId}`).emit("room-chat:all-deleted", {
                deleted_id: toDeleteOwnChats.map(chat => chat._id)
            });
        }

        if (toDeleteOtherChatsPermanent.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOtherChatsPermanent.flatMap(chat => chat.media || []);
            const toDeleteOtherChatsPermanentIds = toDeleteOtherChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.deleteMany({ _id: { $in: toDeleteOtherChatsPermanentIds } }));
        }

        if (toDeleteOtherChats.length > 0) {
            const toDeleteOtherChatsIds = toDeleteOtherChats.map(chat => chat._id);

            operations.push(Chats.updateMany({ _id: { $in: toDeleteOtherChatsIds } }, {
                $addToSet: { hidden_for: userId }
            }));
        }

        if (operations.length > 0) await Promise.all(operations);

        res.status(200).json({ message: "all your message in group deleted permanently" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChosenChatsInRoom(req: AuthRequest, res: Response) {
    try {
        const roomIdParams = req.params.room_id;
        const roomId = Array.isArray(roomIdParams) ? roomIdParams[0] : roomIdParams;

        const userId = req.user?.user_id;
        const ids = req.body.chatsIds as string[];
        const operations = [];

        const members = await User.find({ room_id: { $in: [roomId] } });
        const chats = await Chats.find({ _id: { $in: ids }, room_id: roomId });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const totoDeleteOwnChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id.toString() === userId
        });

        const toDeleteOwnChats = chats.filter(chat => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id.toString() === userId
        });

        const toDeleteOtherChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id.toString() !== userId
        });

        const toDeleteOtherChats = chats.filter(chat => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id.toString() !== userId
        });

        if (totoDeleteOwnChatsPermanent.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = totoDeleteOwnChatsPermanent.flatMap(chat => chat.media || []);
            const totoDeleteOwnChatsPermanentIds = totoDeleteOwnChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.deleteMany({ _id: { $in: totoDeleteOwnChatsPermanentIds } }));
        }

        if (toDeleteOwnChats.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChats.flatMap(chat => chat.media || []);
            const toDeleteOwnChatsIds = toDeleteOwnChats.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.updateMany({ _id: { $in: toDeleteOwnChatsIds } }, {
                $set: {
                    media: [],
                    messages: "This message has been deleted"
                }
            }));
    
            io.to(`room-chat:${roomId}`).emit("room-chat:all-deleted", {
                deleted_id: toDeleteOwnChats.map(chat => chat._id)
            });
        }

        if (toDeleteOtherChatsPermanent.length > 0) {
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOtherChatsPermanent.flatMap(chat => chat.media || []);
            const toDeleteOtherChatsPermanentIds = toDeleteOtherChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
    
            operations.push(Chats.deleteMany({ _id: { $in: toDeleteOtherChatsPermanentIds } }));
        }

        if (toDeleteOtherChats.length > 0) {
            const toDeleteOtherChatsIds = toDeleteOtherChats.map(chat => chat._id);

            operations.push(Chats.updateMany({ _id: { $in: toDeleteOtherChatsIds } }, {
                $addToSet: { hidden_for: userId }
            }));
        }

        if (operations.length > 0) await Promise.all(operations);

        res.status(200).json({ message: "chat deleted from room" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function editSelectedChat(req: AuthRequest, res: Response) {
    try {
        const { _id, room_id } = req.params;
        const { text } = req.body;
        const userId = req.user?.user_id;

        const updatedChat = await Chats.findOneAndUpdate({ _id: _id, room_id: room_id, sender_id: userId }, {
            $set: { messages: text }
        });

        io.to(`room-chat:${room_id}`).emit("room-chat:message-changed", {
            _id: updatedChat?._id,
            message: updatedChat?.messages
        });

        res.status(200).json({ message: "1 chat updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "something  went wrong" });
    }
}

export async function sendToOtherRoom(req: AuthRequest, res: Response) {
    try {
        const user_id = req.user?.user_id;
        const created_at = new Date().toISOString();
        const selectedMedia: CloudinaryUploadResult[] = [];

        const media = req.files as Express.Multer.File[] | undefined;
        const { messages, room_id } = req.body;

        const user = await User.findOne({ _id: user_id });
        if (!user) return res.status(404).json({ message: "user not found" });

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
            sender_id: user_id,
            sender_name: user.username
        });

        await newChat.save();

        io.to(`room-chat:${newChat.room_id}`).emit("room-chat:send-new-chat", {
            _id: newChat._id,
            created_at: newChat.created_at,
            media: newChat.media,
            messages: newChat.messages,
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

        const chatTotal = await Chats.find({ room_id: roomId, hidden_for: { $nin: [userId!] } }).countDocuments();
        if (chatTotal === 0) return res.status(404).json({ message: "chat not found" });

        const chats = await Chats
        .find({ room_id: roomId, hidden_for: { $nin: [userId!] } })
        .limit(limit)
        .skip(skip);

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}