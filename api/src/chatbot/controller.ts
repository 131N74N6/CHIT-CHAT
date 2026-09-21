import { TChatBot } from "./model";
import chatBotService from "./service";

class ChatBotController {
    async deleteAllMessages(user_id: string) {
        await chatBotService.deleteAllMessages(user_id);
        return { message: "all message deleted successfully" }
    }

    async sendQuestion(props: TChatBot["questionAndAnswer"]) {
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