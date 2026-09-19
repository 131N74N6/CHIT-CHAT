import { ObjectId } from "mongodb";
import { User } from "../auth/model";
import { db } from "../mongodb/service";
import { TUserProfile } from "./model";

class UserProfileRepository {
    private group_chats = db().collection("group_chats");
    private group_chats_files = db().collection("group_chats_files");
    private group_profiles = db().collection("group_profiles");
    private users = db().collection<Omit<User, "id">>("user");
    private user_chats = db().collection("user_chats");
    private user_chats_files = db().collection("user_chats_files");
    
    async changeUser(props: TUserProfile["changeResult"]) {
        return await this.users.findOneAndUpdate(
            { _id: new ObjectId(props.id) }, 
            { $set: {
                description: props.description,
                image: props.image,
                image_filename: props.image_filename,
                image_filetype: props.image_filetype,
                image_public_id: props.image_public_id,
                image_resource_type: props.image_resource_type,
                name: props.name
            }},
            { returnDocument: "after" }
        );
    }

    async deleteUser(id: string) {
        return await Promise.all([
            this.group_chats.deleteMany({ sender_id: new ObjectId(id) }),
            this.group_chats_files.deleteMany({ sender_id: new ObjectId(id) }),
            this.group_profiles.deleteMany({ owner_id: new ObjectId(id) }),
            this.user_chats.deleteMany(
                { $or: [{ sender_id: new ObjectId(id) }, { receiver_id: new ObjectId(id) }] }
            ),
            this.user_chats_files.deleteMany({ sender_id: new ObjectId(id) }),
            this.users.deleteOne({ _id: new ObjectId(id) })
        ]);
    }

    async showAllUsers() {
        return await this.users.find().toArray();
    }
}

const userProfileRepository = new UserProfileRepository();

export default userProfileRepository;