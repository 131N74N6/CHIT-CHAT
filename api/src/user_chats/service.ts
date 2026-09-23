import { TUserChat } from "./model";
import userChatRepository from "./repository";
import { userChatEvent } from "./event";
import userChatUseCase from "./usecase";

class UserChatService {
    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        const checkpoint = await userChatUseCase.checkBeforeChangeMessage(props);

        const editedMessage = await userChatRepository.changeMessage({ 
            _id: checkpoint?.messageId!, 
            text: checkpoint?.newText, 
            receiver_id: checkpoint?.receiverId!, 
            sender_id: checkpoint?.senderId! 
        });

        const roomId = this.getRoomId(checkpoint?.receiverId!, checkpoint?.senderId!);
        userChatEvent.emit(roomId, { data: editedMessage, type: "user-message:changed" });
    }

    async clearAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        const checkpoint = await userChatUseCase.checkBeforeClearAll(props);

        await userChatUseCase.executeDeletion({
            deleteMessagePermanently: checkpoint.deleteAllMessagePermanently,
            deleteMessageTemporary: [],
            hideMessages: checkpoint.hideAllMessages,
            sender_id: checkpoint.senderId
        });
    }

    async clearChosenMessage(props: TUserChat["deleteChat"]) {
        const checkpoint = await userChatUseCase.checkBeforeClearChosen(props);

        await userChatUseCase.executeDeletion({
            deleteMessagePermanently: checkpoint.deleteChosenMessagesPermanently,
            deleteMessageTemporary: [],
            hideMessages: checkpoint.hideChosenMessages,
            sender_id: checkpoint.senderId
        });
    }

    async deleteAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        const checkpoint = await userChatUseCase.checkBeforeDeleteAll(props);

        await userChatUseCase.executeDeletion({
            deleteMessagePermanently: [
                ...checkpoint.deleteOwnMessagePermanently, 
                ...checkpoint.deleteOtherMessagesPermanently, 
                ...checkpoint.removeDeletedMessagesPermanently
            ],
            deleteMessageTemporary: checkpoint.deleteOwnMessagesTemporary,
            hideMessages: [...checkpoint.hideDeletedMessages, ...checkpoint.deleteOtherMessagesTemporary],
            sender_id: checkpoint.senderId
        });

        const affectedIds = checkpoint.deleteOwnMessagesTemporary.map((message) => message._id.toString());
        const roomId = this.getRoomId(checkpoint.receiverId, checkpoint.senderId);
        userChatEvent.emit(roomId, { data: affectedIds, type: "user-message:deleted" });
    }

    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        const checkpoint = await userChatUseCase.checkBeforeDeleteChosen(props);

        await userChatUseCase.executeDeletion({
            deleteMessagePermanently: [
                ...checkpoint.deleteOwnMessagePermanently,
                ...checkpoint.deleteOtherMessagesPermanently,
                ...checkpoint.removeDeletedMessagesPermanently
            ],
            deleteMessageTemporary: checkpoint.deleteOwnMessagesTemporary,
            hideMessages: [...checkpoint.hideDeletedMessages, ...checkpoint.deleteOtherMessagesTemporary],
            sender_id: checkpoint.senderId
        });

        const roomId = this.getRoomId(checkpoint.receiverId, checkpoint.senderId);
        const affectedIds = checkpoint.deleteOwnMessagesTemporary.map((message) => message._id.toString());
        userChatEvent.emit(roomId, { data: affectedIds, type: "user-message:deleted" });
    }

    private getRoomId(receiver_id: string, sender_id: string) {
        return [receiver_id, sender_id].sort().join("_");
    }

    async sendMessages(props: TUserChat["sendMessageRaw"]) {
        const checkpoint = await userChatUseCase.checkBeforeSendingMessage(props);

        const message = await userChatRepository.sendMessage({
            files: checkpoint.selectedFiles,
            files_total: checkpoint.filesTotal,
            receiver_id: checkpoint.receiverId,
            sender_id: checkpoint.senderId,
            text: checkpoint.text
        });

        const roomId = this.getRoomId(checkpoint.receiverId, checkpoint.senderId);
        userChatEvent.emit(roomId, { data: message, type: "user-message:sent" });
    }

    async showAllMessages(props: TUserChat["filter"]) {
        const checkpoint = userChatUseCase.checkBeforeShowAllMessages(props);

        return await userChatRepository.showAllMessages({
            limit: props.limit, 
            page: props.page, 
            receiver_id: checkpoint.receiverId, 
            sender_id: checkpoint.senderId
        });
    }

    async showChosenMessageFiles(id: string) {
        const checkpoint = userChatUseCase.checkBeforeShowChosenMessageFiles(id);
        return await userChatRepository.showChosenMessageFiles(checkpoint);
    }
}

const userChatService = new UserChatService();

export default userChatService;