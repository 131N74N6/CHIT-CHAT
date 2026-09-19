import { ObjectId } from "mongodb";
import { TUserChat } from "./model";
import { ChitChatApiError } from "../error/handler";
import { v2 } from "cloudinary";
import userChatRepository from "./repository";
import { userChatEvent } from "./event";
import { uploadToCloudinary } from "../cloudinary/service";
import { CloudinaryUploadResult } from "../cloudinary/model";

class UserChatService {
    private checkIsFileSupported(file: File) {
        const isFileNotSupported = 
        !file.type.includes("image") && 
        !file.type.includes("video") && 
        !file.type.includes("application");

        if (isFileNotSupported) {
            throw new ChitChatApiError("unsupported file", 400);
        }

        return file;
    }

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

    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        const messageId = this.checkIsIdValid("message chat", props._id);
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const message = await userChatRepository.findOneMessageById(messageId);

        if (!message) throw new ChitChatApiError("message not found", 404);
        if (message.text === props.text) return;

        const editedMessage = await userChatRepository.changeMessage({ 
            _id: messageId, 
            text: props.text, 
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

        const chats = await userChatRepository.findAllMessagesById(messageIds);
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

        const chats = await userChatRepository.findAllMessages({ 
            receiver_id: receiverId, sender_id: senderId 
        });

        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteOwnMessagePermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === receiverId && chat.sender_id === senderId)
        });

        const deleteOwnMessagesTemporary = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === receiverId && chat.sender_id === senderId)
        });

        const deleteOtherMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === senderId && chat.sender_id === receiverId)
        });

        const deleteOtherMessagesTemporary = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === senderId && chat.sender_id === receiverId)
        });

        const hideDeletedMessages = chats.filter((chat) => {
            return chat.text === "This message has been deleted" &&
            !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        const removeDeletedMessagesPermanently = chats.filter((chat) => {
            return chat.text === "This message has been deleted" &&
            chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId)
        });

        await this.executeDeletion({
            deleteMessagePermanently: [
                ...deleteOwnMessagePermanently, 
                ...deleteOtherMessagesPermanently, 
                ...removeDeletedMessagesPermanently
            ],
            deleteMessageTemporary: deleteOwnMessagesTemporary,
            hideMessages: [...hideDeletedMessages, ...deleteOtherMessagesTemporary],
            sender_id: senderId
        });

        const affectedIds = deleteOwnMessagesTemporary.map((message) => message._id.toString());
        const roomId = this.getRoomId(receiverId, senderId);
        userChatEvent.emit(roomId, { data: affectedIds, type: "user-message:deleted" });
    }

    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        const messageIds = props.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const chats = await userChatRepository.findAllMessagesById(messageIds);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteOwnMessagePermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === receiverId && chat.sender_id === senderId)
        });

        const deleteOwnMessagesTemporary = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === receiverId && chat.sender_id === senderId)
        });

        const deleteOtherMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === senderId && chat.sender_id === receiverId)
        });

        const deleteOtherMessagesTemporary = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            (chat.receiver_id === senderId && chat.sender_id === receiverId)
        });

        const hideDeletedMessages = chats.filter((chat) => {
            return !chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            chat.text === "This message has been deleted"
        });

        const removeDeletedMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.some((id: ObjectId) => id.toString() === receiverId) &&
            chat.text === "This message has been deleted"
        });

        await this.executeDeletion({
            deleteMessagePermanently: [
                ...deleteOwnMessagePermanently,
                ...deleteOtherMessagesPermanently,
                ...removeDeletedMessagesPermanently
            ],
            deleteMessageTemporary: deleteOwnMessagesTemporary,
            hideMessages: [...hideDeletedMessages, ...deleteOtherMessagesTemporary],
            sender_id: senderId
        });

        const roomId = this.getRoomId(receiverId, senderId);
        const affectedIds = deleteOwnMessagesTemporary.map((message) => message._id.toString());
        userChatEvent.emit(roomId, { data: affectedIds, type: "user-message:deleted" });
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

    private getRoomId(receiver_id: string, sender_id: string) {
        return [receiver_id, sender_id].sort().join("_");
    }

    async sendMessages(props: TUserChat["sendMessageRaw"]) {
        let filesTotal: number = 0;
        let selectedFiles: CloudinaryUploadResult[] = [];
        let text: string = "";

        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const chosenFiles = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : []);

        if (props.text) text = this.checkIsInputAString("message", props.text);

        if (!text && chosenFiles.length === 0) {
            throw new ChitChatApiError("message or file is required", 400);
        }

        if (chosenFiles.length > 8) {
            throw new ChitChatApiError("only accept 8 files or less", 400);
        }

        if (chosenFiles.length > 0) {
            filesTotal = chosenFiles.length;
            
            const result = chosenFiles.map(async (chosenFile) => {
                const file = this.checkIsFileSupported(chosenFile);
                const fileArrayBuffer = await file.arrayBuffer();
                const fileBuffer = Buffer.from(fileArrayBuffer);

                return await uploadToCloudinary({
                    file_buffer: fileBuffer,
                    foldername: "chat_media",
                    mimetype: file.type,
                    original_name: file.name,
                    size: file.size
                });
            });

            selectedFiles = await Promise.all(result);
        }

        const message = await userChatRepository.sendMessage({
            files_total: filesTotal,
            receiver_id: receiverId,
            sender_id: senderId,
            text: text
        });

        if (selectedFiles.length > 0) {
            const uploadedFiles = selectedFiles.map((uploadedFile) => {
                return userChatRepository.sendFiles({
                    file_name: uploadedFile.file_name,
                    file_type: uploadedFile.file_type,
                    message_id: message._id,
                    public_id: uploadedFile.public_id,
                    resource_type: uploadedFile.resource_type,
                    sender_id: message.sender_id,
                    size: uploadedFile.size,
                    url: uploadedFile.url
                });
            });

            await Promise.all(uploadedFiles);
        }

        const roomId = this.getRoomId(receiverId, senderId);
        userChatEvent.emit(roomId, { data: message, type: "user-message:sent" });
    }

    async showAllMessages(props: TUserChat["messagePagination"]) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        return await userChatRepository.showAllMessages({
            limit: props.limit, page: props.page, receiver_id: receiverId, sender_id: senderId
        });
    }

    async showChosenMessageFiles(message_id: string) {
        const messageId = this.checkIsIdValid("message chat", message_id);
        return await userChatRepository.showChosenMessageFiles(messageId);
    }
}

const userChatService = new UserChatService();

export default userChatService;