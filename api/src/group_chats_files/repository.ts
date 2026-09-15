import { db } from "../mongodb/service";
import { GroupChatFilesData } from "./model";

class GroupChatFilesRepository {
    private group_chats_files = db().collection("group_chats_files");

    async sendFiles(data: GroupChatFilesData) {
        return await this.group_chats_files.insertOne({
            created_at: new Date,
            file_name: data.file_name,
            file_type: data.file_type,
            public_id: data.public_id,
            resource_type: data.resource_type,
            size: data.size,
            url: data.url,
            message_id: data.message_id
        });
    }
}

const groupChatFilesRepository = new GroupChatFilesRepository();

export default groupChatFilesRepository;