import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/handler";
import { TGroupChats } from "./model";
import groupChatRepository from "./repository";
import { v2 } from "cloudinary";
import { CloudinaryUploadResult } from "../cloudinary/model";
import { uploadToCloudinary } from "../cloudinary/service";

class GroupChatUseCase {
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

    async checkBeforeChangeChosen(props: TGroupChats["changeMessage"]) {
        const id = this.checkIsIdValid("message chat", props._id);
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

        const message = await groupChatRepository.findOneMessageById(id);
        if (!message) throw new ChitChatApiError("message not found", 404);

        if (message.sender_id.toString() !== senderId) {
            throw new ChitChatApiError("you are not allowed to change this message", 403);
        }

        let text = "";
        
        if (message.text !== text) text = this.checkIsInputAString("message", props.text);

        return { groupId, id, senderId, text }
    }

    async checkBeforeClearAll(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

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

        return { deleteOwnMessagesPermanently, hideAllMessages, senderId }
    }

    async checkBeforeClearChosen(props: TGroupChats["deleteMessage"]) {
        const ids = props.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

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

        return { deleteOwnMessagesPermanently, hideChosenMessages, senderId }
    }

    async checkBeforeDeleteAll(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

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

        return { 
            deleteOtherMessagesPermanently, deleteOtherMessagesTemporary, deleteOwnMessagesPermanently, 
            deleteOwnMessagesTemporary, groupId, hideDeletedMessages, removeDeletedMessgesPermanently, 
            senderId 
        }
    }

    async checkBeforeDeleteChosen(props: TGroupChats["deleteMessage"]) {
        const ids = props.message_ids.map((id) => this.checkIsIdValid("message chat", id));
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);

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

        return {
            deleteOtherMessagesPermanently, deleteOtherMessagesTemporary, deleteOwnMessagesPermanently, 
            deleteOwnMessagesTemporary, groupId, hideDeletedMessages, removeDeletedMessgesPermanently, 
            senderId
        }
    }

    async checkBeforeSendMessage(props: TGroupChats["sendMessageRaw"]) {
        let filesTotal: number = 0;
        let selectedFiles: CloudinaryUploadResult[] = [];
        let text: string = "";

        const chosenFiles = Array.isArray(props.files) ? props.files : (props.files ? [props.files] : []);
        const groupId = this.checkIsIdValid("group", props.group_id);
        const groupName = this.checkIsInputAString("group name", props.group_name);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        const senderName = this.checkIsInputAString("sender name", props.sender_name);

        if (!props.text && chosenFiles.length === 0) {
            throw new ChitChatApiError("file or message is required", 400);
        }

        if (props.text) text = this.checkIsInputAString("message", props.text);

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

        return { filesTotal, groupId, groupName, senderId, senderName, selectedFiles, text }
    }

    checkBeforeShowAll(props: Omit<TGroupChats["additionalFilter"], "skip">) {
        const groupId = this.checkIsIdValid("group", props.group_id);
        const senderId = this.checkIsIdValid("sender", props.sender_id);
        return { groupId, senderId }
    }

    checkBeforeShowUploadedFilesByMessageId(id: string) {
        const messageId = this.checkIsIdValid("message chat", id);
        return messageId;
    }
    
    async executeDeletion(data: TGroupChats["executeDeletion"]) {
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
}

const groupChatUseCase = new GroupChatUseCase();

export default groupChatUseCase;