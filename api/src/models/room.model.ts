import mongoose, { Schema, Types } from "mongoose";

export interface RoomIntrf {
    created_at: string;
    creator_id: Types.ObjectId;
    description: string;
    name: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    };
}

const roomSchema = new Schema<RoomIntrf>({
    created_at: { type: String, required: true },
    creator_id: { type: Schema.Types.ObjectId, required: true },
    description: { type: String },
    name: { type: String, required: true },
    profile_picture: {
        public_id: { type: String },
        resource_type: { type: String },
        url: { type: String }
    }
});

export const Rooms = mongoose.model("rooms", roomSchema, "rooms");