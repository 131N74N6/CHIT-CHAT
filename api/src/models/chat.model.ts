import mongoose, { Schema, Types } from "mongoose";

export interface ChatIntrf {
    created_at: string;
    hidden_for: Types.ObjectId[];
    media: {
        public_id: string;
        resource_type: string;
        url: string;
    }[];
    messages: string;
    receiver_id: Types.ObjectId;
    room_id: Types.ObjectId;
    sender_id: Types.ObjectId;
}

const chatSchema = new Schema<ChatIntrf>({
    created_at: { type: String, required: true },
    hidden_for: [{ type: Schema.Types.ObjectId }],
    media: [{
        public_id: { type: String },
        resource_type: { type: String },
        url: { type: String }
    }],
    messages: { type: String },
    receiver_id: { type: Schema.Types.ObjectId },
    room_id: { type: Schema.Types.ObjectId },
    sender_id: { type: Schema.Types.ObjectId, required: true },
});

export const Chats = mongoose.model<ChatIntrf>("chats", chatSchema, "chats");