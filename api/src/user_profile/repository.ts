import { ObjectId } from "mongodb";
import { User } from "../auth/model";
import { db } from "../mongodb/service";
import { TUserProfile } from "./model";

class UserProfileRepository {
    private accounts = db().collection("account");
    private chatbots = db().collection("chatbots");
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
                    address: props.address,
                    gender: props.gender,
                    description: props.description,
                    image: props.image,
                    image_filename: props.image_filename,
                    image_filetype: props.image_filetype,
                    image_public_id: props.image_public_id,
                    image_resource_type: props.image_resource_type,
                    name: props.name,
                    updatedAt: new Date()
                }
            })
        ]);

        return await this.findUserById(props.id);
    }

    async deleteUser(id: string) {
        await Promise.all([
            this.accounts.deleteOne({ userId: new ObjectId(id) }),
            this.chatbots.deleteMany({ user_id: new ObjectId(id) }),
            this.group_chats.deleteMany({ sender_id: new ObjectId(id) }),
            this.user_chats.deleteMany(
                { $or: [{ sender_id: new ObjectId(id) }, { receiver_id: new ObjectId(id) }] }
            ),
            this.sessions.deleteMany({ userId: new ObjectId(id) }),
            this.users.deleteOne({ _id: new ObjectId(id) })
        ]);

        return id;
    }

    async deleteUserProfilePicture(id: string) {
        const result = await this.users.findOneAndUpdate(
            { $or: [{ sender_id: new ObjectId(id) }, { receiver_id: new ObjectId(id) }] },
            { $set: {
                image: "-",
                image_filename: "-",
                image_filetype: "-",
                image_public_id: "-",
                image_resource_type: "-",
                updatedAt: new Date()
            }
        }, { returnDocument: "after" });

        return result;
    }

    async deleteYourGroups(id: string) {
        return await this.group_profiles.deleteMany({ owner_id: new ObjectId(id) });
    }

    async findUserById(id: string) {
        return await this.users.findOne({ _id: new ObjectId(id) }, {
            projection: {
                _id: 1,
                address: 1,
                createdAt: 1,
                group_ids: 1,
                gender: 1,
                image: 1,
                description: 1,
                name: 1,
                image_public_id: 1,
            }
        });
    }

    async findYourGroupProfiles(id: string) {
        return await this.group_profiles.find({ owner_id: new ObjectId(id) }).toArray();
    }

    async findGroupChatMessagesFiles(id: string) {
        return await this.group_chats.find(
            { sender_id: new ObjectId(id) }, 
            { projection: { files: 1 } }
        ).toArray();
    }

    async findUserMessagesFiles(id: string) {
        return await this.user_chats.find({ 
                $or: [{ sender_id: new ObjectId(id) }, { receiver_id: new ObjectId(id) }] 
            }, 
            { projection: { files: 1 } }
        )
        .toArray();
    }

    async leftGroup(group_id: string) {
        return await this.users.updateOne({ group_ids: { $in: [group_id]} }, {
            $pull: { group_ids: [group_id] }
        });
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        return await this.users.find({ _id: { $ne: new ObjectId(props.id)} }, {
            projection: {
                _id: 1,
                name: 1,
                image: 1,
                image_public_id: 1,
            }
        })
        .sort({ name: 1 })
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showUser(props: TUserProfile["showUser"]) {
        return await this.users.findOne({ _id: new ObjectId(props.id) }, {
            projection: {
                _id: 1,
                address: 1,
                createdAt: 1,
                gender: 1,
                image: 1,
                description: 1,
                name: 1,
                image_public_id: 1,
            }
        });
    }
}

const userProfileRepository = new UserProfileRepository();

export default userProfileRepository;