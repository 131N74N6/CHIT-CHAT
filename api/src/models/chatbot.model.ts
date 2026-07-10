import mongoose, { Schema, Types } from "mongoose";

export interface ChatBotIntrf {
    created_at: string;
    question: string;
    response: string;
    user_id: Types.ObjectId;
}

const chatBotSchema = new Schema<ChatBotIntrf>({
    created_at: { type: String, required: true },
    question: { type: String, required: true },
    response: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true }
});

export const ChatBot = mongoose.model("chatbot", chatBotSchema, "chatbot");