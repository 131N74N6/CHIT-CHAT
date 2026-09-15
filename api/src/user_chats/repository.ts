import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TUserChat } from "./model";

class UserChatRepository {
    private user_chats = db().collection("user_chats");
    private messages_files = db().collection("user_chats_files");

    async changeMessage(data: TUserChat["changeMessageResult"]) {
        return await this.user_chats.findOneAndUpdate({ 
            _id: new ObjectId(data._id),
            receiver_id: new ObjectId(data.receiver_id),
            sender_id: new ObjectId(data.sender_id)
        }, {
            $set: { text: data.text, updated_at: new Date() }
        }, { returnDocument: "after" });
    }

    async deleteAllMessagesPermanently(ids: ObjectId[]) {
        return await Promise.all([
            this.messages_files.deleteMany({ message_id: { $in: ids }}),
            this.user_chats.deleteMany({ _id: { $in: ids } })
        ]);
    }

    async deleteAllMessagesTemporary(ids: ObjectId[]) {
        return await Promise.all([
            this.messages_files.deleteMany({ message_id: { $in: ids }}),
            this.user_chats.updateMany({ _id: { $in: ids }}, {
                $set: { files_total: 0, text: "This message has been deleted" }
            })
        ]);
    }

    async findAllMessages(data: Omit<TUserChat["deleteChat"], "message_ids">) {
        return await this.user_chats.aggregate([
            { $match: { 
                $or: [
                    { 
                        sender_id: new ObjectId(data.sender_id), 
                        receiver_id: new ObjectId(data.receiver_id) 
                    }, 
                    { 
                        sender_id: new ObjectId(data.receiver_id), 
                        receiver_id: new ObjectId(data.sender_id) 
                    }
                ],
                hidden_for: { $nin: [new ObjectId(data.sender_id)] }
            }},
            { $lookup: {
                from: "messages_files",
                localField: "_id",
                foreignField: "message_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async findAllMessagesById(message_ids: string[]) {
        const ids = message_ids.map(id => new ObjectId(id));
        return await this.user_chats.aggregate([
            { $match: { _id: { $in: ids } }},
            { $lookup: {
                from: "messages_files",
                localField: "_id",
                foreignField: "message_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async findOneMessageById(message_id: string) {
        return await this.user_chats.findOne({ _id: new ObjectId(message_id) });
    }

    async hideChosenMessages(data: TUserChat["hideChosenMessages"]) {
        return await this.user_chats.updateMany({ _id: { $in: data.message_ids }}, {
            $addToSet: { hidden_for: new ObjectId(data.user_id) }
        });
    }

    async sendMessage(data: TUserChat["sendMessageResult"]) {
        const newMessage = {
            created_at: new Date(),
            files_total: data.files_total,
            hidden_for: [],
            text: data.text,
            updated_at: new Date(),
            sender_id: new ObjectId(data.sender_id),
            receiver_id: new ObjectId(data.receiver_id)
        }

        const result = await this.user_chats.insertOne(newMessage);
        return { ...newMessage, _id: result.insertedId }
    }

    async showAllMessages(data: Omit<TUserChat["messagePagination"], "page">) {
        return await this.user_chats.aggregate([
            { $match: { 
                $or: [
                    { 
                        sender_id: new ObjectId(data.sender_id), 
                        receiver_id: new ObjectId(data.receiver_id) 
                    }, 
                    { 
                        sender_id: new ObjectId(data.receiver_id), 
                        receiver_id: new ObjectId(data.sender_id) 
                    }
                ],
                hidden_for: { $nin: [new ObjectId(data.sender_id)] }
            }},
            { $sort: { created_at: -1 }},
            { $limit: data.limit },
            { $skip: data.skip },
            { $lookup: {
                from: "messages_files",
                localField: "_id",
                foreignField: "message_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async showChosenMessageFiles(message_id: string) {
        return await this.user_chats.findOne({ _id: new ObjectId(message_id) }, { projection: { files: 1 }});
    }
}

const userChatRepository = new UserChatRepository();

export default userChatRepository;