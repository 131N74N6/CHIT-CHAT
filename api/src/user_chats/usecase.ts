import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/handler";
import { TUserChat } from "./model";
import userChatRepository from "./repository";
import { CloudinaryUploadResult } from "../cloudinary/model";
import { uploadToCloudinary } from "../cloudinary/service";
import { v2 } from "cloudinary";

class UserChatUseCase {
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

    async checkBeforeChangeMessage(props: TUserChat["changeMessageResult"]) {
        const messageId = this.checkIsIdValid("message chat", props._id);
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const newText = this.checkIsInputAString("text", props.text);

        const message = await userChatRepository.findOneMessageById(messageId);
        if (!message) throw new ChitChatApiError("message not found", 404);
        if (message.text === newText) return;

        return { messageId, newText, receiverId, senderId }
    }

    async checkBeforeClearAll(props: Omit<TUserChat["deleteChat"], "message_ids">) {
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

        return { deleteAllMessagePermanently, hideAllMessages, senderId }
    }

    async checkBeforeClearChosen(props: TUserChat["deleteChat"]) {
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

        return { deleteChosenMessagesPermanently, hideChosenMessages, messageIds, senderId }
    }

    async checkBeforeDeleteAll(props: Omit<TUserChat["deleteChat"], "message_ids">) {
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

        return { 
            deleteOwnMessagePermanently, deleteOwnMessagesTemporary, deleteOtherMessagesPermanently, 
            deleteOtherMessagesTemporary, hideDeletedMessages, receiverId, removeDeletedMessagesPermanently, 
            senderId
        }
    }

    async checkBeforeDeleteChosen(props: TUserChat["deleteChat"]) {
        const messageIds = props.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const chats = await userChatRepository.findChosenMessagesById(messageIds);
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

        return {
            deleteOtherMessagesPermanently, deleteOtherMessagesTemporary, deleteOwnMessagePermanently, 
            deleteOwnMessagesTemporary, hideDeletedMessages, receiverId, removeDeletedMessagesPermanently,
            senderId
        }
    }

    async checkBeforeSendingMessage(props: TUserChat["sendMessageRaw"]) {
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

        return { filesTotal, receiverId, selectedFiles, senderId, text }
    }

    checkBeforeShowAllMessages(props: TUserChat["filter"]) {
        const receiverId = this.checkIsIdValid("receiver", props.receiver_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        return { receiverId, senderId }
    }

    checkBeforeShowChosenMessageFiles(id: string) {
        const messageId = this.checkIsIdValid("message chat", id);
        return messageId;
    }

    async executeDeletion(props: TUserChat["executeDeletion"]) {
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
}

const userChatUseCase = new UserChatUseCase();

export default userChatUseCase;