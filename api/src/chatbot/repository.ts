import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TChatBot } from "./model";

class ChatBotRepository {
    private chatbots = db().collection("chatbots");

    async deleteAllMessages(user_id: string) {
        return await this.chatbots.deleteMany({ user_id: new ObjectId(user_id) });
    }
    
    async sendAnswerToUser(props: TChatBot["questionAndAnswer"]) {
        return await this.chatbots.insertOne({
            created_at: new Date(),
            role: props.role,
            answer: props.answer,
            user_id: new ObjectId(props.user_id),
            question_id: new ObjectId(props.question_id)
        });
    }
    
    async sendQuestion(props: TChatBot["questionAndAnswer"]) {
        const newData = {
            created_at: new Date(),
            role: props.role,
            question: props.question,
            user_id: new ObjectId(props.user_id)
        }

        const result = await this.chatbots.insertOne(newData);
        return { question: newData.question, question_id: result.insertedId }
    }

    async showAllChatBotResults(props: TChatBot["filter"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        return await this.chatbots.find({ user_id: new  ObjectId(props.user_id) })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 })
        .toArray();
    }
}

const chatBotRepository = new ChatBotRepository();

export default chatBotRepository;