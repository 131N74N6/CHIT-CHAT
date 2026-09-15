import { ObjectId } from "mongodb";

export type UserChatFilesData = {
    file_name: string;
    file_type: string;
    public_id: string;
    resource_type: string;
    size: number;
    url: string;
    message_id: ObjectId;
}