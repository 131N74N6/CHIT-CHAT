import { TGroupChats } from "./model";
import groupChatService from "./service";

class GroupChatController {
    async changeChosenMessage(props: TGroupChats["changeMessage"]) {
        await groupChatService.changeChosenMessage(props);
        return { message: "message has changed" }
    }

    async clearAllMessages(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        await groupChatService.clearAllMessages(props);
        return { message: "all messages from group chat has cleared" }
    }

    async clearChosenMessages(props: TGroupChats["deleteMessage"]) {
        await groupChatService.clearChosenMessages(props);
        return { message: "chosen messages from group chat has cleared" }
    }

    async deleteAllMessages(props: Omit<TGroupChats["deleteMessage"], "message_ids">) {
        await groupChatService.deleteAllMessages(props);
        return { message: "all messages from group chat has deleted" }
    }

    async deleteChosenMessages(props: TGroupChats["deleteMessage"]) {
        await groupChatService.deleteChosenMessages(props);
        return { message: "chosen messages from group chat has deleted" }
    }

    async sendMessage(props: TGroupChats["sendMessageRaw"]) {
        await groupChatService.sendMessage(props);
        return { message: "your message has been sent" }
    }

    async showAllMessages(props: TGroupChats["additionalFilter"]) {
        const messages = await groupChatService.showAllMessages(props);
        return { data: messages }
    }

    async showUploadedFilesByMessageId(id: string) {
        const files = await groupChatService.showUploadedFilesByMessageId(id);
        return { data: files }
    }
}

const groupChatController = new GroupChatController();

export default groupChatController;