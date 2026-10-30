import { TUserChat } from "./model";
import userChatRepository from "./repository";
import { userChatEvent } from "./event";
import { ChitChatApiError } from "../error/service";
import { ObjectId } from "mongodb";
import { v2 } from "cloudinary";
import { uploadToCloudinary } from "../cloudinary/service";
import { CloudinaryUploadResult } from "../cloudinary/model";

class UserChatService {
    private checkIsIdValid(field: string, value: unknown) {
        if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }
        return value;
    }

    private checkIsInputAString(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string") {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }
        return value;
    }

    private async executeDeletion(props: TUserChat["executeDeletion"]) {
        const operations: Promise<any>[] = [];

        this.executeMediaDeletion({
            deleteFunctions: (ids) => userChatRepository.deleteAllMessagesPermanently(ids),
            messages: props.deleteMessagePermanently,
            operations: operations,
        });

        this.executeMediaDeletion({
            deleteFunctions: (ids) => userChatRepository.deleteAllMessagesTemporary(ids),
            messages: props.deleteMessageTemporary,
            operations: operations
        });

        if (props.hideMessages.length > 0) {
            const ids = props.hideMessages.map(message => message._id);
            operations.push(userChatRepository.hideChosenMessages({ 
                user_id: props.sender_id, message_ids: ids 
            }));
        }

        if (operations.length > 0) await Promise.all(operations);
    }

    private executeMediaDeletion(props: TUserChat["executeMediaDeletion"]) {
        if (props.messages.length === 0) return;
        const selectedMessageids = props.messages.map(message => message._id);
        const selectedFiles = props.messages.flatMap(message => message.files || []);

        if (selectedFiles.length > 0) {
            const removeFromCloudinary = selectedFiles.map(files => {
                return v2.uploader.destroy(files.public_id, { resource_type: files.resource_type });
            });

            props.operations.push(...removeFromCloudinary);
        }

        props.operations.push(props.deleteFunctions(selectedMessageids));
    }
    
    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        const messageId = this.checkIsIdValid("message chat", props._id);
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const newText = this.checkIsInputAString("text", props.text);

        const message = await userChatRepository.findOneMessageById(messageId);
        if (!message) throw new ChitChatApiError("message not found", 404);
        if (message.text === newText) return;

        const editedMessage = await userChatRepository.changeMessage({ 
            _id: messageId, 
            text: newText, 
            receiver_id: receiverId, 
            sender_id: senderId 
        });

        const roomId = this.getRoomId(receiverId, senderId);
        userChatEvent.emit(roomId, { data: editedMessage, type: "user-message:changed" });
    }

    async clearAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const chats = await userChatRepository.findAllMessages(props);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteAllMessagePermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        const hideAllMessages = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        await this.executeDeletion({
            deleteMessagePermanently: deleteAllMessagePermanently,
            deleteMessageTemporary: [],
            hideMessages: hideAllMessages,
            sender_id: senderId
        });
    }

    async clearChosenMessage(props: TUserChat["deleteChat"]) {
        const messageIds = props.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const chats = await userChatRepository.findChosenMessagesById(messageIds);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteChosenMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        const hideChosenMessages = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        await this.executeDeletion({
            deleteMessagePermanently: deleteChosenMessagesPermanently,
            deleteMessageTemporary: [],
            hideMessages: hideChosenMessages,
            sender_id: senderId
        });
    }

    async deleteAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const chats = await userChatRepository.findAllMessages({ receiver_id: receiverId, sender_id: senderId });
        if (chats.length === 0) throw new ChitChatApiError("messages not found", 404);

        const toDeleteOwnPermanent = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === receiverId && chat.sender_id.toString() === senderId);
        });

        const toDeleteOwnTemporary = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === receiverId && chat.sender_id.toString() === senderId);
        });

        const toDeleteOtherPermanent = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === senderId && chat.sender_id.toString() === receiverId);
        });

        const toDeleteOtherTemporary = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === senderId && chat.sender_id.toString() === receiverId);
        });

        const toHideDeletedChat = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) && 
            chat.text === "This message has been deleted";
        });
        
        const toRemoveDeletedChat = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) && 
            chat.text === "This message has been deleted";
        });

        await this.executeDeletion({
            deleteMessagePermanently: [
                ...toDeleteOwnPermanent, ...toDeleteOtherPermanent, ...toRemoveDeletedChat
            ],
            deleteMessageTemporary: toDeleteOwnTemporary,
            hideMessages: [...toDeleteOtherTemporary, ...toHideDeletedChat],
            sender_id: senderId
        });

        const affectedIds = toDeleteOwnTemporary.map(message => message._id.toString());

        if (chats.length > 0) {
            const roomId = this.getRoomId(senderId, receiverId);
            userChatEvent.emit(roomId, { type: "user-message:deleted", data: affectedIds });
        }
    }

    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const messageIds = props.message_ids.map(id => this.checkIsIdValid("", id));

        const chats = await userChatRepository.findChosenMessagesById(messageIds);
        if (chats.length === 0) throw new ChitChatApiError("messages not found", 404);

        const toDeleteOwnPermanent = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === receiverId && chat.sender_id.toString() === senderId);
        });

        const toDeleteOwnTemporary = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === receiverId && chat.sender_id.toString() === senderId);
        });

        const toDeleteOtherPermanent = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === senderId && chat.sender_id.toString() === receiverId);
        });

        const toDeleteOtherTemporary = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id.toString() === senderId && chat.sender_id.toString() === receiverId);
        });

        const toHideDeletedChat = chats.filter(chat => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) && 
            chat.text === "This message has been deleted";
        });
        
        const toRemoveDeletedChat = chats.filter(chat => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) && 
            chat.text === "This message has been deleted";
        });

        await this.executeDeletion({
            deleteMessagePermanently: [
                ...toDeleteOwnPermanent, ...toDeleteOtherPermanent, ...toRemoveDeletedChat
            ],
            deleteMessageTemporary: toDeleteOwnTemporary,
            hideMessages: [...toDeleteOtherTemporary, ...toHideDeletedChat],
            sender_id: senderId
        });

        const affectedIds = toDeleteOwnTemporary.map(message => message._id.toString());

        if (chats.length > 0) {
            const roomId = this.getRoomId(senderId, receiverId);
            userChatEvent.emit(roomId, { type: "user-message:deleted", data: affectedIds });
        }
    }

    private getRoomId(receiver_id: string, sender_id: string) {
        return [receiver_id, sender_id].sort().join("_");
    }

    async sendMessages(props: TUserChat["sendMessageRaw"]) {
        let selectedMedia: CloudinaryUploadResult[] = [];
        let newMessage = "";
        const chosenFiles = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : []);

        if (props.text) newMessage = this.checkIsInputAString("message", props.text);
        if (!newMessage && chosenFiles.length === 0) throw new ChitChatApiError("message or media is required", 400);
        
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        if (chosenFiles.length > 10) {
            throw new ChitChatApiError("only accept 10 files or less", 400);
        }
    
        if (chosenFiles.length > 0) {
            const uploadPromises = chosenFiles.map(async (chosenFile) => {
                if (!chosenFile.type.includes("image") && 
                !chosenFile.type.includes("video") && 
                !chosenFile.type.includes("application")) {
                    throw new ChitChatApiError(`unsupported file type: ${chosenFile.name}`, 400);
                }

                const fileArrayBuffer = await chosenFile.arrayBuffer();
                const fileBuffer = Buffer.from(fileArrayBuffer);
                
                return await uploadToCloudinary({
                    file_buffer: fileBuffer,
                    foldername: "chat_media",
                    mimetype: chosenFile.type,
                    original_name: chosenFile.name
                });
            });

            selectedMedia = await Promise.all(uploadPromises);
        }

        const message = await userChatRepository.sendMessages({
            files: selectedMedia,
            files_total: selectedMedia.length,
            text: newMessage,
            receiver_id: receiverId,
            sender_id: senderId,
        });

        const roomId = this.getRoomId(senderId, receiverId);
        userChatEvent.emit(roomId, { data: message, type: "user-message:sent"});
    }

    async showAllMessages(props: TUserChat["filter"]) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        return await userChatRepository.showAllMessages({
            limit: props.limit, 
            page: props.page, 
            receiver_id: receiverId, 
            sender_id: senderId
        });
    }

    async showChosenMessageFiles(id: string) {
        const messageId = this.checkIsIdValid("message chat", id);
        return await userChatRepository.showChosenMessageFiles(messageId);
    }
}

const userChatService = new UserChatService();

export default userChatService;