import mongoose, { Schema, Types } from "mongoose";

export interface UserIntrf {
    address: string;
    created_at: string;
    email: string;
    gender: string;
    password: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    room_id: Types.ObjectId[];
    username: string;
}

const userSchema = new Schema<UserIntrf>({
    address: { type: String },
    created_at: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String },
    password: { type: String, required: true },
    profile_picture: {
        public_id: { type: String, required: true },
        resource_type: { type: String, required: true },
        url: { type: String, required: true }
    },
    room_id: [{ type: Schema.Types.ObjectId }],
    username: { type: String, required: true },
});

export const User = mongoose.model<UserIntrf>("users", userSchema, "users");