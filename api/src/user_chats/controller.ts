import { TUserChat } from "./model";
import userChatService from "./service";

class UserChatController {
    async changeChosenMessage(data: TUserChat["changeMessageResult"]) {
        await userChatService.changeChosenMessage(data);
        return { message: "message has changed" }
    }

    async clearAllMessages(data: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.clearAllMessages(data);
        return { message: "all messages cleared" }
    }

    async clearChosenMessage(data: TUserChat["deleteChat"]) {
        await userChatService.clearChosenMessage(data);
        return { message: "messages cleared" }
    }

    async deleteAllMessages(data: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.deleteAllMessages(data);
        return { message: "all messages deleted" }
    }

    async deleteChosenMessages(data: TUserChat["deleteChat"]) {
        await userChatService.deleteChosenMessages(data);
        return { message: "messages deleted" }
    }

    async sendMessages(data: TUserChat["sendMessageRaw"]) {
        await userChatService.sendMessages(data);
        return { message: "message has been sent" }
    }

    async showAllMessages(data: Omit<TUserChat["messagePagination"], "skip">) {
        const messages = await userChatService.showAllMessages(data);
        return { data: messages, message: "messages retrieved successfully" }
    }

    async showChosenMessageFiles(message_id: string) {
        const files = await userChatService.showChosenMessageFiles(message_id);
        return { data: files, message: "files retrieved successfully" }
    }
}

const userChatController = new UserChatController();

export default userChatController;