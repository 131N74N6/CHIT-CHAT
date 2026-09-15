import { db } from "../mongodb/service";
import { UserChatFilesData } from "./model";

class UserChatFilesRepository {
    private user_chats_files = db().collection("user_chats_files");

    async sendFiles(data: UserChatFilesData) {
        return await this.user_chats_files.insertOne({
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

const userChatFilesRepository = new UserChatFilesRepository();

export default userChatFilesRepository;