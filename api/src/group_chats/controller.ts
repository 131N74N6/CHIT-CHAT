import { TGroupChats } from "./model";
import groupChatService from "./service";

class GroupChatController {
    async changeChosenMessage(data: TGroupChats["changeMessage"]) {
        await groupChatService.changeChosenMessage(data);
        return { message: "message has changed" }
    }

    async clearAllMessages(data: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        await groupChatService.clearAllMessages(data);
        return { message: "all messages from group chat has cleared" }
    }

    async clearChosenMessages(data: TGroupChats["deleteMessage"]) {
        await groupChatService.clearChosenMessages(data);
        return { message: "chosen messages from group chat has cleared" }
    }

    async deleteAllMessages(data: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        await groupChatService.deleteAllMessages(data);
        return { message: "all messages from group chat has deleted" }
    }

    async deleteChosenMessages(data: TGroupChats["deleteMessage"]) {
        await groupChatService.deleteChosenMessages(data);
        return { message: "chosen messages from group chat has deleted" }
    }

    async sendMessage(data: TGroupChats["sendMessageRaw"]) {
        await groupChatService.sendMessage(data);
        return { message: "your message has been sent" }
    }

    async showAllMessages(data: Omit<TGroupChats["additionalFilter"], "skip">) {
        const messages = await groupChatService.showAllMessages(data);
        return { data: messages }
    }

    async showUploadedFilesByMessageId(id: string) {
        const files = await groupChatService.showUploadedFilesByMessageId(id);
        return { data: files }
    }
}

const groupChatController = new GroupChatController();

export default groupChatController;