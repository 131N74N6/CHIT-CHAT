import mongoose, { Schema, Types } from "mongoose";

export interface ChatBotIntrf {
    created_at: string;
    question: string;
    answer: string;
    role: string;
    question_id: Types.ObjectId;
    user_id: Types.ObjectId;
}

const chatBotSchema = new Schema<ChatBotIntrf>({
    created_at: { type: String, required: true },
    question: { type: String },
    answer: { type: String },
    role: { type: String },
    question_id: { type: Schema.Types.ObjectId },
    user_id: { type: Schema.Types.ObjectId }
});

export const ChatBot = mongoose.model("chatbot", chatBotSchema, "chatbot");