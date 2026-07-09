import mongoose, { Schema } from "mongoose";

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
    username: string;
}

const userSchema = new Schema<UserIntrf>({
    address: { type: String, default: "-" },
    created_at: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, default: "-" },
    password: { type: String, required: true },
    profile_picture: {
        public_id: { type: String, required: true },
        resource_type: { type: String, required: true },
        url: { type: String, required: true }
    },
    username: { type: String, required: true },
});

export const User = mongoose.model<UserIntrf>("users", userSchema, "users");