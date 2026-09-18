import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TUserChat } from "./model";

class UserChatRepository {
    private user_chats = db().collection("user_chats");
    private user_chats_files = db().collection("user_chats_files");

    async changeMessage(props: TUserChat["changeMessageResult"]) {
        return await this.user_chats.findOneAndUpdate({ 
            _id: new ObjectId(props._id),
            receiver_id: new ObjectId(props.receiver_id),
            sender_id: new ObjectId(props.sender_id)
        }, {
            $set: { text: props.text, updated_at: new Date() }
        }, { returnDocument: "after" });
    }

    async deleteAllMessagesPermanently(ids: ObjectId[]) {
        return await Promise.all([
            this.user_chats_files.deleteMany({ message_id: { $in: ids }}),
            this.user_chats.deleteMany({ _id: { $in: ids } })
        ]);
    }

    async deleteAllMessagesTemporary(ids: ObjectId[]) {
        return await Promise.all([
            this.user_chats_files.deleteMany({ message_id: { $in: ids }}),
            this.user_chats.updateMany({ _id: { $in: ids }}, {
                $set: { files_total: 0, text: "This message has been deleted" }
            })
        ]);
    }

    async findAllMessages(props: Omit<TUserChat["deleteChat"], "message_ids">) {
        return await this.user_chats.aggregate([
            { $match: { 
                $or: [
                    { 
                        sender_id: new ObjectId(props.sender_id), 
                        receiver_id: new ObjectId(props.receiver_id) 
                    }, 
                    { 
                        sender_id: new ObjectId(props.receiver_id), 
                        receiver_id: new ObjectId(props.sender_id) 
                    }
                ],
                hidden_for: { $nin: [new ObjectId(props.sender_id)] }
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

    async hideChosenMessages(props: TUserChat["hideChosenMessages"]) {
        return await this.user_chats.updateMany({ _id: { $in: props.message_ids }}, {
            $addToSet: { hidden_for: new ObjectId(props.user_id) }
        });
    }

    async sendFiles(props: TUserChat["sendFiles"]) {
        return await this.user_chats_files.insertOne({
            created_at: new Date,
            file_name: props.file_name,
            file_type: props.file_type,
            public_id: props.public_id,
            resource_type: props.resource_type,
            size: props.size,
            url: props.url,
            message_id: props.message_id
        });
    }

    async sendMessage(props: TUserChat["sendMessageResult"]) {
        const newMessage = {
            created_at: new Date(),
            files_total: props.files_total,
            hidden_for: [],
            text: props.text,
            updated_at: new Date(),
            sender_id: new ObjectId(props.sender_id),
            receiver_id: new ObjectId(props.receiver_id)
        }

        const result = await this.user_chats.insertOne(newMessage);
        return { ...newMessage, _id: result.insertedId }
    }

    async showAllMessages(props: TUserChat["messagePagination"]) {
        const page = props.page;
        const limit = props.limit;
        const skip = (page - 1) * limit;

        return await this.user_chats.aggregate([
            { $match: { 
                $or: [
                    { 
                        sender_id: new ObjectId(props.sender_id), 
                        receiver_id: new ObjectId(props.receiver_id) 
                    }, 
                    { 
                        sender_id: new ObjectId(props.receiver_id), 
                        receiver_id: new ObjectId(props.sender_id) 
                    }
                ],
                hidden_for: { $nin: [new ObjectId(props.sender_id)] }
            }},
            { $sort: { created_at: -1 }},
            { $limit: limit },
            { $skip: skip },
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