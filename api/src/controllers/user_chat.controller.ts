import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Chats } from "../models/chat.model";
import { CloudinaryUploadResult, uploadTOCloudinary } from "../services/cloudinary.service";
import { v2 } from "cloudinary";
import { io } from "../services/socket_io.service";
import { Types } from "mongoose";

export async function clearAllUserChatsForMe(req: AuthRequest, res: Response) {
    try {
        const userId = req.user?.user_id;
        const receiverIdParams = req.params.receiver_id;
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;
        
        const chats = await Chats.find({ 
            $or: [
                { receiver_id: receiverId, sender_id: userId },
                { receiver_id: userId, sender_id: receiverId }, 
            ], 
            hidden_for: { $nin: [userId!] } 
        });
        
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });
        
        const operations = [];
        
        const toDeleteChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId))
        });

        const selectedMedia: CloudinaryUploadResult[] = toDeleteChatsPermanent.flatMap(chat => chat.media || []);

        const toDeleteChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId))
        });

        if (toDeleteChatsPermanent.length > 0) {
            const toDeleteChatsPermanentIds = toDeleteChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });

                operations.push(...deleteFromCloudinary);
            }

            operations.push(Chats.deleteMany({ _id: { $in: toDeleteChatsPermanentIds } }));
        }

        if (toDeleteChats.length > 0) {
            const toDeleteChatsIds = toDeleteChats.map(chat => chat._id);

            operations.push(Chats.updateMany({ _id: { $in: toDeleteChatsIds } }, {
                $addToSet: { hidden_for: userId }
            }));
        }

        if (operations.length > 0) await Promise.all(operations);

        res.status(200).json({ message: "all chats cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function clearChosenUserChatsForMe(req: AuthRequest, res: Response) {
    try {
        const ids = req.body.chatsIds as string[];
        const userId = req.user?.user_id;
        const receiverIdParams = req.params.receiver_id;
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;

        const operations = [];

        const chats = await Chats.find({ _id: { $in: ids } });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const toDeleteChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId))
        });
        
        const selectedMedia: CloudinaryUploadResult[] = toDeleteChatsPermanent.flatMap(chat => chat.media) || [];

        const toDeleteChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId))
        });

        if (toDeleteChatsPermanent.length > 0) {
            const toDeleteChatsPermanentIds = toDeleteChatsPermanent.map(chat => chat._id);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });

                operations.push(...deleteFromCloudinary);
            }

            operations.push(Chats.deleteMany({ _id: { $in: toDeleteChatsPermanentIds } }));
        }

        if (toDeleteChats.length > 0) {
            const toDeleteChatsIds = toDeleteChats.map(chat => chat._id);

            operations.push(Chats.updateMany({ _id: { $in: toDeleteChatsIds } }, {
                $addToSet: { hidden_for: userId }
            }));
        }

        if (operations.length > 0) await Promise.all(operations);

        res.status(200).json({ message: "chat cleared" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteAllUserChats(req: AuthRequest, res: Response) {
    try {
        const operations = [];
        const userId = req.user?.user_id;

        const receiverIdParams = req.params.receiver_id;
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;

        const chats = await Chats.find({
            $or: [
                { receiver_id: receiverId, sender_id: userId },
                { receiver_id: userId, sender_id: receiverId }
            ], 
            hidden_for: { $nin: [userId!] } 
        });

        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const toDeleteOwnChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(receiverId) || chat.sender_id === new Types.ObjectId(userId))
        });

        const toDeleteOwnChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(receiverId) || chat.sender_id === new Types.ObjectId(userId))
        });

        const toDeleteOtherChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(userId) || chat.sender_id === new Types.ObjectId(receiverId))
        });

        const toDeleteOtherChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(userId) || chat.sender_id === new Types.ObjectId(receiverId))
        });

        if (toDeleteOwnChatsPermanent.length > 0) {
            const toDeleteOwnChatsPermanentIds = toDeleteOwnChatsPermanent.map(chat => chat._id);
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChatsPermanent.flatMap(chat => chat.media || []);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type });
                });
    
                operations.push(...deleteFromCloudinary);
            }
            
            operations.push(Chats.deleteMany({ _id: { $in: toDeleteOwnChatsPermanentIds } }));
        }

        if (toDeleteOwnChats.length > 0) {
            const toDeleteOwnChatsIds = toDeleteOwnChats.map(chat => chat._id);
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChats.flatMap(chat => chat.media || []);

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

            io.to(`user-chat:${receiverId}`).emit("user-chat:all-deleted", {
                deleted_id: toDeleteOwnChats.map(chat => chat._id)
            });
        }

        if (toDeleteOtherChatsPermanent) {
            const toDeleteOtherChatsPermanentIds = toDeleteOtherChatsPermanent.map(chat => chat._id);
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOtherChatsPermanent.flatMap(chat => chat.media || []);

            if (selectedMedia.length > 0) {
                const deleteFormCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type })
                });

                operations.push(...deleteFormCloudinary);
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

        res.status(200).json({ message: "all chats deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function deleteChosenUsersChat(req: AuthRequest, res: Response) {
    try {
        const operations = [];
        const userId = req.user?.user_id;
        const receiverIdParams = req.params.receiver_id
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;

        const ids = req.body.chatsIds as string[];
        const chats = await Chats.find({ _id: { $in: ids } });
        if (chats.length === 0) return res.status(404).json({ message: "chat not found" });

        const toDeleteOwnChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(receiverId) || chat.sender_id === new Types.ObjectId(userId))
        });

        const toDeleteOwnChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(receiverId) || chat.sender_id === new Types.ObjectId(userId))
        });

        const toDeleteOtherChatsPermanent = chats.filter(chat => {
            return chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(userId) || chat.sender_id === new Types.ObjectId(receiverId))
        });

        const toDeleteOtherChats = chats.filter(chat => {
            return !chat.hidden_for.includes(new Types.ObjectId(receiverId)) && 
            (chat.receiver_id === new Types.ObjectId(userId) || chat.sender_id === new Types.ObjectId(receiverId))
        });

        if (toDeleteOtherChatsPermanent.length > 0) {
            const toDeleteOtherChatsPermanentIds = toDeleteOtherChatsPermanent.map(chat => chat._id);
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOtherChatsPermanent.flatMap(chat => chat.media || []);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type })
                });

                operations.push(...deleteFromCloudinary);
            }

            operations.push(Chats.deleteMany({ _id: { $in: toDeleteOtherChatsPermanentIds } }));
        }

        if (toDeleteOwnChats.length > 0) {
            const toDeleteOwnChatsIds = toDeleteOwnChats.map(chat => chat._id);
            const selectedMedia: CloudinaryUploadResult[] = toDeleteOwnChats.flatMap(chat => chat.media || []);

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

            io.to(`user-chat:${receiverId}`).emit("user-chat:deleted", {
                deleted_id: toDeleteOwnChats.map(chat => chat._id)
            });
        }

        if (toDeleteOtherChatsPermanent.length > 0) {
            const toDeleteOtherChatsPermanentIds = toDeleteOtherChatsPermanent.map(chat => chat._id);
            const selectedMedia = toDeleteOtherChatsPermanent.flatMap(chat => chat.media || []);

            if (selectedMedia.length > 0) {
                const deleteFromCloudinary = selectedMedia.map(media => {
                    return v2.uploader.destroy(media.public_id, { resource_type: media.resource_type })
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


        res.status(200).json({ message: "chat deleted" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function editSelectedChat(req: Request, res: Response) {
    try {
        const { _id, receiverId } = req.params;
        const { text } = req.body;

        const updatedChat = await Chats.findOneAndUpdate({ _id: _id }, {
            $set: { messages: text }
        });

        io.to(`user-chat:${receiverId}`).emit("user-chat:message-changed", {
            _id: updatedChat?._id,
            message: updatedChat?.messages
        });

        res.status(200).json({ message: "1 chat updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "something  went wrong" });
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

        io.to(`user-chat:${newChat.receiver_id}`).emit("user-chat:send-new-chat", {
            _id: newChat._id,
            created_at: newChat.created_at,
            media: newChat.media,
            messages: newChat.messages,
        });

        res.status(200).json({ message: "new chat for other user added" });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

export async function showAllChats(req: AuthRequest, res: Response) {
    try {
        const receiverIdParams = req.params.receiver_id;
        const userId = req.user?.user_id;
        const receiverId = Array.isArray(receiverIdParams) ? receiverIdParams[0] : receiverIdParams;

        const limit = parseInt(req.query.limit as string) || 14;
        const page = parseInt(req.query.page as string) || 1;
        const skip = (page - 1) * limit;

        const chats = await Chats
        .find({ 
            $or: [
                { receiver_id: receiverId, sender_id: userId },
                { receiver_id: userId, sender_id: receiverId }, 
            ], 
            hidden_for: { $nin: [userId!, receiverId] } 
        })
        .limit(limit)
        .skip(skip);

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}