import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupChats } from "./model";
import { User } from "../auth/model";

class GroupChatRepository {
    private group_chats = db().collection("group_chats");
    private users = db().collection<Omit<User, "id">>("user");

    async changeChosenMessage(props: TGroupChats["changeMessage"]) {
        const edited = await this.group_chats.findOneAndUpdate({ 
            _id: new ObjectId(props._id), 
            group_id: new ObjectId(props.group_id), 
            sender_id: new ObjectId(props.group_id),
        }, {
            $set: { text: props.text, updated_at: new Date() }
        }, { returnDocument: "after" });

        return edited;
    }

    async deleteMessagesPermanently(ids: ObjectId[]) {
        return await this.group_chats.deleteMany({ _id: { $in: ids }});
    }

    async deleteMessagesTemporary(ids: ObjectId[]) {
        return await this.group_chats.updateMany({ _id: { $in: ids }}, { 
            $set: { files: [], files_total: 0, text: "This message has been deleted" } 
        });
    }

    async findAllMessages(group_id: string) {
        return await this.group_chats.find({ group_id: new ObjectId(group_id) }).toArray();
    }

    async findChosenMessagesById(ids: string[]) {
        const messageIds = ids.map((id) => new ObjectId(id));
        return await this.group_chats.find({ _id: { $in: messageIds } }).toArray();
    }

    async findOneMessageById(id: string) {
        return await this.group_chats.findOne({ _id: new ObjectId(id) });
    }

    async findAllMembers(group_id: string) {
        return await this.users.find({ group_ids: { $in: [group_id] } }).toArray();
    }

    async hideMessages(props: TGroupChats["hideChosenMessages"]) {
        return await this.group_chats.updateMany({ _id: { $in: props.message_ids }}, {
            $addToSet: { hidden_for: props.sender_id }
        });
    }

    async sendMessages(props: TGroupChats["sendMessageResult"]) {
        const message = {
            created_at: new Date(),
            files: props.files,
            files_total: props.files_total,
            group_id: new ObjectId(props.group_id),
            hidden_for: [],
            group_name: props.group_name,
            sender_id: new ObjectId(props.sender_id),
            sender_name: props.sender_name,
            text: props.text,
            updated_at: new Date()
        }

        const result = await this.group_chats.insertOne(message);
        return { ...message, _id: result.insertedId }
    }

    async showAllMessages(props: TGroupChats["additionalFilter"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1);

        return await this.group_chats.find({ 
            group_id: new ObjectId(props.group_id), 
            hidden_for: { $nin: [new ObjectId(props.sender_id)] } 
        }, { 
            projection: { 
                _id: 1, 
                created_at: 1, 
                files_total: 1, 
                sender_id: 1, 
                sender_name: 1, 
                text: 1, 
                updated_at: 1 
            } 
        })
        .sort({ created_at: -1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showUploadedFilesByMessageId(id: string) {
        return await this.group_chats.findOne({ _id: new ObjectId(id) }, { projection: { files: 1 } });
    }
}

const groupChatRepository = new GroupChatRepository();

export default groupChatRepository;