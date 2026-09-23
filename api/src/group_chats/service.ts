import { TGroupChats } from "./model";
import groupChatRepository from "./repository";
import { groupChatEvent } from "./event";
import groupChatUseCase from "./usecase";

class GroupChatService {
    async changeChosenMessage(props: TGroupChats["changeMessage"]) {
        const checkpoint = await groupChatUseCase.checkBeforeChangeChosen(props);

        const edited = await groupChatRepository.changeChosenMessage({ 
            _id: checkpoint.id, 
            group_id: checkpoint.groupId, 
            sender_id: checkpoint.senderId, 
            text: checkpoint.text 
        });

        groupChatEvent.emit(checkpoint.groupId, { data: edited, type: "group-message:changed" });
    }
    
    async clearAllMessages(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const checkpoint = await groupChatUseCase.checkBeforeClearAll(props);

        await groupChatUseCase.executeDeletion({
            deleteMessagesPermanently: checkpoint.deleteOwnMessagesPermanently,
            deleteMessagesTemporary: [],
            hideMessages: checkpoint.hideAllMessages,
            sender_id: checkpoint.senderId
        });
    }

    async clearChosenMessages(props: TGroupChats["deleteMessage"]) {
        const checkpoint = await groupChatUseCase.checkBeforeClearChosen(props);

        await groupChatUseCase.executeDeletion({
            deleteMessagesPermanently: checkpoint.deleteOwnMessagesPermanently,
            deleteMessagesTemporary: [],
            hideMessages: checkpoint.hideChosenMessages,
            sender_id: checkpoint.senderId
        });
    }

    async deleteAllMessages(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        const checkpoint = await groupChatUseCase.checkBeforeDeleteAll(props);

        await groupChatUseCase.executeDeletion({
            deleteMessagesPermanently: [
                ...checkpoint.deleteOwnMessagesPermanently, 
                ...checkpoint.deleteOtherMessagesPermanently,
                ...checkpoint.removeDeletedMessgesPermanently
            ],
            deleteMessagesTemporary: checkpoint.deleteOwnMessagesTemporary,
            hideMessages: [...checkpoint.deleteOtherMessagesTemporary, ...checkpoint.hideDeletedMessages],
            sender_id: checkpoint.senderId
        });

        const affectedIds = checkpoint.deleteOtherMessagesTemporary.map((message) => message._id.toString());
        groupChatEvent.emit(checkpoint.groupId, { data: affectedIds, type: "group-message:deleted" });
    }

    async deleteChosenMessages(props: TGroupChats["deleteMessage"]) {
        const checkpoint = await groupChatUseCase.checkBeforeDeleteChosen(props);

        await groupChatUseCase.executeDeletion({
            deleteMessagesPermanently: [
                ...checkpoint.deleteOtherMessagesPermanently,
                ...checkpoint.deleteOwnMessagesPermanently,
                ...checkpoint.removeDeletedMessgesPermanently
            ],
            deleteMessagesTemporary: checkpoint.deleteOwnMessagesTemporary,
            hideMessages: [...checkpoint.deleteOtherMessagesTemporary, ...checkpoint.hideDeletedMessages],
            sender_id: checkpoint.senderId
        });

        const affectedIds = checkpoint.deleteOwnMessagesTemporary.map((message) => message._id.toString());
        groupChatEvent.emit(checkpoint.groupId, { data: affectedIds, type: "group-message:deleted" });
    }

    async sendMessage(props: TGroupChats["sendMessageRaw"]) {
        const checkpoint = await groupChatUseCase.checkBeforeSendMessage(props);

        const message = await groupChatRepository.sendMessages({
            files: checkpoint.selectedFiles,
            files_total: checkpoint.filesTotal,
            group_id: checkpoint.groupId,
            group_name: checkpoint.groupName,
            sender_id: checkpoint.senderId,
            sender_name: checkpoint.senderName,
            text: checkpoint.text
        });

        groupChatEvent.emit(checkpoint.groupId, { data: message, type: "group-message:sent" });
    }

    async showAllMessages(props: Omit<TGroupChats["additionalFilter"], "skip">) {
        const checkpoint = groupChatUseCase.checkBeforeShowAll(props);

        return await groupChatRepository.showAllMessages({
            group_id: checkpoint.groupId, 
            sender_id: checkpoint.senderId, 
            page: props.page, 
            limit: props.limit
        });
    }

    async showUploadedFilesByMessageId(id: string) {
        const checkpoint = groupChatUseCase.checkBeforeShowUploadedFilesByMessageId(id);
        return await groupChatRepository.showUploadedFilesByMessageId(checkpoint);
    }
}

const groupChatService = new GroupChatService();

export default groupChatService;