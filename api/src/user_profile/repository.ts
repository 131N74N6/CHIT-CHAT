import { ObjectId } from "mongodb";
import { User } from "../auth/model";
import { db } from "../mongodb/service";
import { TUserProfile } from "./model";

class UserProfileRepository {
    private accounts = db().collection("account");
    private group_chats = db().collection("group_chats");
    private group_profiles = db().collection("group_profiles");
    private sessions = db().collection("session");
    private users = db().collection<Omit<User, "id">>("user");
    private user_chats = db().collection("user_chats");
    
    async changeUser(props: TUserProfile["changeResult"]) {
        await Promise.all([
            this.group_chats.updateMany({ sender_id: new ObjectId(props.id) }, {
                $set: { sender_name: props.name }
            }),
            this.users.updateOne({ _id: new ObjectId(props.id) }, { 
                $set: {
                    description: props.description,
                    image: props.image,
                    image_filename: props.image_filename,
                    image_filetype: props.image_filetype,
                    image_public_id: props.image_public_id,
                    image_resource_type: props.image_resource_type,
                    name: props.name
                }
            })
        ]);

        return props;
    }

    async deleteUser(id: string) {
        await Promise.all([
            this.accounts.deleteOne({ userId: new ObjectId(id) }),
            this.group_chats.deleteMany({ sender_id: new ObjectId(id) }),
            this.group_profiles.deleteMany({ owner_id: new ObjectId(id) }),
            this.user_chats.deleteMany(
                { $or: [{ sender_id: new ObjectId(id) }, { receiver_id: new ObjectId(id) }] }
            ),
            this.sessions.deleteMany({ userId: new ObjectId(id) }),
            this.users.deleteOne({ _id: new ObjectId(id) })
        ]);

        return id;
    }

    async findUserById(props: TUserProfile["showUser"]) {
        return await this.users.findOne({ _id: new ObjectId(props.id) }, {
            projection: {
                _id: 1,
                createdAt: 1,
                name: 1,
                image_public_id: 1,
                image_filename: 1,
                image_resource_type: 1
            }
        });
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        return await this.users.find({}, {
            projection: {
                _id: 1,
                createdAt: 1,
                name: 1,
                image: 1,
                image_public_id: 1,
            }
        }).limit(limit).skip(skip).toArray();
    }

    async showUser(props: TUserProfile["showUser"]) {
        return await this.users.findOne({ _id: new ObjectId(props.id) }, {
            projection: {
                _id: 1,
                createdAt: 1,
                name: 1,
                image: 1,
                description: 1,
                image_public_id: 1,
            }
        });
    }
}

const userProfileRepository = new UserProfileRepository();

export default userProfileRepository;