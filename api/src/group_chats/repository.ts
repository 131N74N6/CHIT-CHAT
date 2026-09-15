import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupChats } from "./model";

class GroupChatRepository {
    private group_chats = db().collection("group_chats");
    private group_members = db().collection("group_members");
    private messages_files = db().collection("group_chats_files");

    async changeChosenMessage(data: TGroupChats["changeMessage"]) {
        const edited = await this.group_chats.findOneAndUpdate({ 
            _id: new ObjectId(data._id), 
            group_id: new ObjectId(data.group_id), 
            sender_id: new ObjectId(data.group_id),
        }, {
            $set: { text: data.text, updated_at: new Date() }
        }, { returnDocument: "after" });

        return edited;
    }

    async deleteMessagesPermanently(ids: ObjectId[]) {
        return await Promise.all([
            this.messages_files.deleteMany({ message_id: { $in: ids } }),
            this.group_chats.deleteMany({ _id: { $in: ids }})
        ]);
    }

    async deleteMessagesTemporary(ids: ObjectId[]) {
        return await Promise.all([
            this.messages_files.deleteMany({ message_id: { $in: ids } }),
            this.group_chats.updateMany({ _id: { $in: ids }}, {
                $set: { text: "This message has been deleted", files_total: 0 }
            })
        ]);
    }

    async findAllMessages(group_id: string) {
        return await this.group_chats.aggregate([
            { $match: { group_id: new ObjectId(group_id) }},
            { $lookup: {
                from: "group_chats_files",
                foreignField: "message_id",
                localField: "_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async findChosenMessagesById(ids: string[]) {
        const messageIds = ids.map((id) => new ObjectId(id));

        return await this.group_chats.aggregate([
            { $match: { _id: { $in: messageIds }}},
            { $lookup: {
                from: "group_chats_files",
                foreignField: "message_id",
                localField: "_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async findOneMessageById(id: string) {
        return await this.group_chats.findOne({ _id: new ObjectId(id) });
    }

    async findAllMembers(group_id: string) {
        return await this.group_members.find({ group_id: { $in: [new ObjectId(group_id)] } }).toArray();
    }

    async hideMessages(data: TGroupChats["hideChosenMessages"]) {
        return await this.group_chats.updateMany({ _id: { $in: data.message_ids }}, {
            $addToSet: { hidden_for: data.sender_id }
        });
    }

    async sendMessages(data: TGroupChats["sendMessageResult"]) {
        const message = {
            created_at: new Date(),
            files_total: data.files_total,
            group_id: data.group_id,
            hidden_for: [],
            group_name: data.group_name,
            sender_id: data.sender_id,
            sender_name: data.sender_name,
            text: data.text,
            updated_at: new Date()
        }

        const result = await this.group_chats.insertOne(message);
        return { ...message, _id: result.insertedId }
    }

    async showAllMessages(data: Omit<TGroupChats["additionalFilter"], "page">) {
        return await this.group_chats.aggregate([
            { $match: { 
                group_id: new ObjectId(data.group_id), 
                hidden_for: { $nin: [new ObjectId(data.sender_id)] } 
            }},
            { $sort: { created_at: -1 }},
            { $limit: data.limit },
            { $skip: data.skip },
            { $lookup: {
                from: "group_chats_files",
                foreignField: "message_id",
                localField: "_id",
                as: "files"
            }}
        ])
        .toArray();
    }

    async showUploadedFilesByMessageId(id: string) {
        return await this.messages_files.find({ message_id: new ObjectId(id) }).toArray();
    }
}

const groupChatRepository = new GroupChatRepository();

export default groupChatRepository;