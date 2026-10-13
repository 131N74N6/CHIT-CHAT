import { TUserChat } from "./model";
import userChatService from "./service";

class UserChatController {
    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        await userChatService.changeChosenMessage(props);
    }

    async clearAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.clearAllMessages(props);
    }

    async clearChosenMessage(props: TUserChat["deleteChat"]) {
        await userChatService.clearChosenMessage(props);
    }

    async deleteAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.deleteAllMessages(props);
    }

    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        await userChatService.deleteChosenMessages(props);
    }

    async sendMessages(data: TUserChat["sendMessageRaw"]) {
        await userChatService.sendMessages(data);
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