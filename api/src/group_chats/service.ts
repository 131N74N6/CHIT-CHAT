import { v2 } from "cloudinary";
import { TGroupChats } from "./model";
import groupChatRepository from "./repository";
import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/handler";
import { groupChatEvent } from "./event";
import { uploadToCloudinary } from "../cloudinary/service";
import { CloudinaryUploadResult } from "../cloudinary/model";

class GroupChatService {
    private checkIsFileSupported(file: File) {
        const isFileNotSupported = !file.type.includes("image") && 
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
        if (!value || typeof value !== "string" || value === "") {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }

    async changeChosenMessage(data: TGroupChats["changeMessage"]) {
        const id = this.checkIsIdValid("message chat", data._id);
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);
        const message = await groupChatRepository.findOneMessageById(id);

        if (!message) throw new ChitChatApiError("message not found", 404);

        if (message.sender_id.toString() !== senderId) {
            throw new ChitChatApiError("you are not allowed to change this message", 403);
        }
        
        const text = this.checkIsInputAString("message", data.text);

        if (message.text === text) return;

        const edited = await groupChatRepository.changeChosenMessage({ 
            _id: id, group_id: groupId, sender_id: senderId, text: text 
        });

        groupChatEvent.emit(groupId, { data: edited, type: "group-message:changed" });
    }
    
    async clearAllMessages(data: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);

        const members = await groupChatRepository.findAllMembers(groupId);
        if (members.length === 0) throw new ChitChatApiError("member not found", 404);

        const chats = await groupChatRepository.findAllMessages(groupId);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteOwnMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length;
        });

        const hideAllMessages = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length;
        });

        await this.executeDeletion({
            deleteMessagesPermanently: deleteOwnMessagesPermanently,
            deleteMessagesTemporary: [],
            hideMessages: hideAllMessages,
            sender_id: senderId
        });
    }

    async clearChosenMessages(data: TGroupChats["deleteMessage"]) {
        const ids = data.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);

        const chats = await groupChatRepository.findChosenMessagesById(ids);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const members = await groupChatRepository.findAllMembers(groupId);
        if (members.length === 0) throw new ChitChatApiError("member not found", 404);

        const deleteOwnMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length;
        });

        const hideChosenMessages = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length;
        });

        await this.executeDeletion({
            deleteMessagesPermanently: deleteOwnMessagesPermanently,
            deleteMessagesTemporary: [],
            hideMessages: hideChosenMessages,
            sender_id: senderId
        });
    }

    async deleteAllMessages(data: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);

        const members = await groupChatRepository.findAllMembers(groupId);
        if (members.length === 0) throw new ChitChatApiError("member not found", 404);

        const chats = await groupChatRepository.findAllMessages(groupId);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const deleteOwnMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id === senderId;
        });

        const deleteOwnMessagesTemporary = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id === senderId;
        });

        const deleteOtherMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id !== senderId;
        });

        const deleteOtherMessagesTemporary = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id !== senderId
        });

        const hideDeletedMessages = chats.filter((chat) => {
            return chat.text === "This message has been deleted" &&
            chat.hidden_for.length + 1 < members.length;
        });

        const removeDeletedMessgesPermanently = chats.filter((chat) => {
            return chat.text === "This message has been deleted" && 
            chat.hidden_for.length + 1 === members.length;
        });

        await this.executeDeletion({
            deleteMessagesPermanently: [
                ...deleteOwnMessagesPermanently, 
                ...deleteOtherMessagesPermanently,
                ...removeDeletedMessgesPermanently
            ],
            deleteMessagesTemporary: deleteOwnMessagesTemporary,
            hideMessages: [...deleteOtherMessagesTemporary, ...hideDeletedMessages],
            sender_id: senderId
        });

        const affectedIds = deleteOtherMessagesTemporary.map((message) => message._id.toString());
        groupChatEvent.emit(groupId, { data: affectedIds, type: "group-message:deleted" });
    }

    async deleteChosenMessages(data: TGroupChats["deleteMessage"]) {
        const ids = data.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);

        const chats = await groupChatRepository.findChosenMessagesById(ids);
        if (chats.length === 0) throw new ChitChatApiError("chat not found", 404);

        const members = await groupChatRepository.findAllMembers(groupId);
        if (members.length === 0) throw new ChitChatApiError("member not found", 404);

        const deleteOwnMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id === senderId;
        });

        const deleteOwnMessagesTemporary = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id === senderId;
        });

        const deleteOtherMessagesPermanently = chats.filter((chat) => {
            return chat.hidden_for.length + 1 === members.length && chat.sender_id !== senderId;
        });

        const deleteOtherMessagesTemporary = chats.filter((chat) => {
            return chat.hidden_for.length + 1 < members.length && chat.sender_id !== senderId;
        });

        const hideDeletedMessages = chats.filter((chat) => {
            return chat.text === "This message has been deleted" &&
            chat.hidden_for.length + 1 < members.length;
        });

        const removeDeletedMessgesPermanently = chats.filter((chat) => {
            return chat.text === "This message has been deleted" &&
            chat.hidden_for.length + 1 === members.length;
        });

        await this.executeDeletion({
            deleteMessagesPermanently: [
                ...deleteOtherMessagesPermanently,
                ...deleteOwnMessagesPermanently,
                ...removeDeletedMessgesPermanently
            ],
            deleteMessagesTemporary: deleteOwnMessagesTemporary,
            hideMessages: [...deleteOtherMessagesTemporary, ...hideDeletedMessages],
            sender_id: senderId
        });

        const affectedIds = deleteOwnMessagesTemporary.map((message) => message._id.toString());
        groupChatEvent.emit(groupId, { data: affectedIds, type: "group-message:deleted" });
    }

    private async executeDeletion(data: TGroupChats["executeDeletion"]) {
        const operations: Promise<any>[] = [];

        this.executeMediaDeletion({
            deleteFunction: (ids) => groupChatRepository.deleteMessagesPermanently(ids),
            messages: data.deleteMessagesPermanently,
            operations: operations
        });

        this.executeMediaDeletion({
            deleteFunction: (ids) => groupChatRepository.deleteMessagesTemporary(ids),
            messages: data.deleteMessagesTemporary,
            operations: operations
        });

        if (data.hideMessages.length > 0) {
            const ids = data.hideMessages.map((message) => message._id);
            operations.push(groupChatRepository.hideMessages({ message_ids: ids, sender_id: data.sender_id }));
        }

        if (operations.length > 0) await Promise.all(operations);
    }
    
    private executeMediaDeletion(data: TGroupChats["executeMediaDeletion"]) {
        if (data.messages.length === 0) return;

        const ids = data.messages.map((message) => message._id);
        const chosenFiles = data.messages.flatMap((message) => message.files || []);

        if (chosenFiles.length > 0) {
            const removeFromCloudinary = chosenFiles.map((chosenFile) => {
                return v2.uploader.destroy(chosenFile.public_id, { 
                    resource_type: chosenFile.resource_type 
                });
            });
            data.operations.push(...removeFromCloudinary);
        }

        data.operations.push(data.deleteFunction(ids));
    }

    async sendMessage(data: TGroupChats["sendMessageRaw"]) {
        let filesTotal: number = 0;
        let selectedFiles: CloudinaryUploadResult[] = [];
        let text: string = "";

        const chosenFiles = Array.isArray(data.files) ? data.files : (data.files ? [data.files] : []);
        const groupId = this.checkIsIdValid("group", data.group_id);
        const groupName = this.checkIsInputAString("group name", data.group_name);
        const senderId = this.checkIsIdValid("sender", data.sender_id);
        const senderName = this.checkIsInputAString("sender name", data.sender_name);

        if (!data.text && chosenFiles.length === 0) {
            throw new ChitChatApiError("file or message is required", 400);
        }

        if (data.text) text = this.checkIsInputAString("message", data.text);

        if (chosenFiles.length > 8) {
            throw new ChitChatApiError("only accept 8 files or less", 400);
        }

        if (chosenFiles.length > 0) {
            filesTotal = chosenFiles.length;

            const result = chosenFiles.map(async (chosenFile) => {
                const file = this.checkIsFileSupported(chosenFile);
                const arrayBuffer = await file.arrayBuffer();
                const fileBuffer = Buffer.from(arrayBuffer);

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

        const message = await groupChatRepository.sendMessages({
            files_total: filesTotal,
            group_id: groupId,
            group_name: groupName,
            sender_id: senderId,
            sender_name: senderName,
            text: text
        });

        if (selectedFiles.length > 0) {
            const uploadedFiles = selectedFiles.map((uploadedFile) => {
                return groupChatRepository.sendFiles({
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

        groupChatEvent.emit(groupId, { data: message, type: "group-message:sent" });
    }

    async showAllMessages(data: Omit<TGroupChats["additionalFilter"], "skip">) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const senderId = this.checkIsIdValid("sender", data.sender_id);

        const limit = data.limit;
        const page = data.page;
        const skip = (page - 1) * limit;

        const messages = await groupChatRepository.showAllMessages({
            group_id: groupId, skip: skip, limit: limit, sender_id: senderId
        });

        return messages;
    }

    async showUploadedFilesByMessageId(id: string) {
        const messageIds = this.checkIsIdValid("message chat", id)
        return await groupChatRepository.showUploadedFilesByMessageId(messageIds);
    }
}

const groupChatService = new GroupChatService();

export default groupChatService;