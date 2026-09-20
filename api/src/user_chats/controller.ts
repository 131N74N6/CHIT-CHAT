import { TUserChat } from "./model";
import userChatService from "./service";

class UserChatController {
    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        await userChatService.changeChosenMessage(props);
        return { message: "message has changed" }
    }

    async clearAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.clearAllMessages(props);
        return { message: "all messages cleared" }
    }

    async clearChosenMessage(props: TUserChat["deleteChat"]) {
        await userChatService.clearChosenMessage(props);
        return { message: "messages cleared" }
    }

    async deleteAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.deleteAllMessages(props);
        return { message: "all messages deleted" }
    }

    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        await userChatService.deleteChosenMessages(props);
        return { message: "messages deleted" }
    }

    async sendMessages(data: TUserChat["sendMessageRaw"]) {
        await userChatService.sendMessages(data);
        return { message: "message has been sent" }
    }

    async showAllMessages(props: TUserChat["filter"]) {
        const messages = await userChatService.showAllMessages(props);
        return { data: messages }
    }

    async showChosenMessageFiles(id: string) {
        const files = await userChatService.showChosenMessageFiles(id);
        return { data: files }
    }
}

const userChatController = new UserChatController();

export default userChatController;