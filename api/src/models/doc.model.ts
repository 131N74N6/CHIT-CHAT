import mongoose, { Schema, Types } from "mongoose";

export interface DocIntrf {
    created_at: string;
    codes: string;
    language: string;
    result: string;
    user_id: Types.ObjectId;
}

const docSchema = new Schema<DocIntrf>({
    created_at: { type: String, required: true },
    codes: { type: String, required: true },
    language: { type: String, required: true },
    result: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true },
});

export const Docs = mongoose.model<DocIntrf>("docs", docSchema, "docs");