import { TUserChat } from "./model";
import userChatService from "./service";

class UserChatController {
    async changeChosenMessage(props: TUserChat["changeMessageResult"]) {
        await userChatService.changeChosenMessage(props);
        return { message: "message updated successfully" };
    }

    async clearAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.clearAllMessages(props);
        return { message: "all messages has cleared successfully" };
    }

    async clearChosenMessage(props: TUserChat["deleteChat"]) {
        await userChatService.clearChosenMessage(props);
        return { message: "chosen messages has cleared successfully" };
    }

    async deleteAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        await userChatService.deleteAllMessages(props);
        return { message: "all messages has deleted successfully" };
    }
    
    async deleteChosenMessages(props: TUserChat["deleteChat"]) {
        await userChatService.deleteChosenMessages(props);
        return { message: "chosen messages has deleted successfully" };
    }

    async sendMessages(data: TUserChat["sendMessageRaw"]) {
        await userChatService.sendMessages(data);
        return { message: "message has ben sent successfully" };
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