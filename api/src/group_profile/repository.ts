import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupProfile } from "./model";
import { User } from "../auth/model";

class GroupProfileRepository {
    private group_chats = db().collection("group_chats");
    private group_profiles = db().collection("group_profiles");
    private users = db().collection<Omit<User, "id">>("user");

    async changeGroup(props: TGroupProfile["changeGroupResult"]) {
        await Promise.all([
            this.group_chats.updateMany({ group_id: new ObjectId(props._id) }, {
                $set: { group_name: props.group_name }
            }),
            this.group_profiles.updateOne({ 
                _id: new ObjectId(props._id), owner_id: new ObjectId(props.owner_id) 
            }, {
                $set: {
                    group_description: props.group_description,
                    group_name: props.group_name,
                    group_profile: props.group_profile
                }
            })
        ]);

        return props;
    }

    async createGroup(props: TGroupProfile["createGroupResult"]) {
        return await Promise.all([
            this.group_profiles.insertOne({
                group_description: props.group_description,
                group_name: props.group_name,
                group_profile: props.group_profile,
                owner_id: new ObjectId(props.owner_id)
            }),
            this.users.updateOne({ _id: new ObjectId(props.owner_id) }, {
                $addToSet: { group_ids: [props.owner_id.toString()] }
            })
        ]);
    }

    async deleteGroup(props: TGroupProfile["deleteGroup"]) {
        await Promise.all([
            this.group_chats.deleteMany({ group_id: new ObjectId(props.group_id) }),
            this.users.updateMany({ group_ids: { $in: [props.group_id] } }, {
                $pull: { group_ids: props.group_id }
            }),
            this.group_profiles.deleteOne({ owner_id: new ObjectId(props.owner_id) })
        ]);

        return props;
    }

    async showAllGroups(props: TGroupProfile["filter"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        return await this.group_profiles.find({ user_ids: { $in: [new ObjectId(props.user_id)] }})
        .limit(limit)
        .skip(skip)
        .toArray();
    }
}

const groupProfileRepository = new GroupProfileRepository();

export default groupProfileRepository;