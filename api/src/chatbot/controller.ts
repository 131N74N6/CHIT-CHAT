import { TChatBot } from "./model";
import chatBotService from "./service";

class ChatBotController {
    async deleteAllMessages(user_id: string) {
        await chatBotService.deleteAllMessages(user_id);
        return { message: "all message from this bot has deleted" }
    }
    
    async deleteChosenMessages(ids: string[]) {
        await chatBotService.deleteChosenMessages(ids);
        return { message: "chosen message from this bot has deleted" }
    }

    async sendQuestion(props: Pick<TChatBot["questionAndAnswer"], "question" | "user_id">) {
        const result = await chatBotService.sendQuestion(props);
        return { data: result }
    }

    async showAllChatBotResults(props: TChatBot["filter"]) {
        const result = await chatBotService.showAllChatBotResults(props);
        return { data: result }
    }
}

const chatBotController = new ChatBotController();

export default chatBotController;