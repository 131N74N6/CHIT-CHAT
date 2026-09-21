import { ObjectId } from "mongodb";
import chatBotRepository from "./repository";
import { ChitChatApiError } from "../error/handler";
import { TChatBot } from "./model";
import { getAndShowResponse } from "../open_router/service";

class ChatBotService {
    private checkIsIdValid(field: string, value: unknown) {
        if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }
        return value;
    }
    private checkInputIsAString(field: string, value: unknown) {
        if (!value || value === "" || typeof value !== "string") {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }
        return value;
    }

    async deleteAllMessages(user_id: string) {
        const userId = this.checkIsIdValid("user", user_id);
        await chatBotRepository.deleteAllMessages(userId);
    }

    async sendQuestion(props: TChatBot["questionAndAnswer"]) {
        const userId = this.checkIsIdValid("user", props.user_id);
        const question = this.checkInputIsAString("question", props.question);
        
        const aiAnswer = await getAndShowResponse(question);
        const getAnswer = this.checkInputIsAString("answer", aiAnswer.result);

        const newQuestion = await chatBotRepository.sendQuestion({ 
            question: question, role: "user/human", user_id: userId 
        });

        await chatBotRepository.sendAnswerToUser({
            answer: aiAnswer.result, role: "ai/bot", user_id: userId, question_id: newQuestion.question_id
        });

        return getAnswer;
    }

    async showAllChatBotResults(props: TChatBot["filter"]) {
        const userId = this.checkIsIdValid("user", props.user_id);
        return await chatBotRepository.showAllChatBotResults({ 
            limit: props.limit, page: props.page, user_id: userId 
        });
    }
}

const chatBotService = new ChatBotService();

export default chatBotService;