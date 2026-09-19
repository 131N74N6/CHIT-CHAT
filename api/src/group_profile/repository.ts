import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupProfile } from "./model";
import { User } from "../auth/model";

class GroupProfileRepository {
    private group_chats = db().collection("group_chats");
    private group_profiles = db().collection("group_profiles");
    private users = db().collection<Omit<User, "id">>("user");

    async changeGroup(props: TGroupProfile["changeGroupResult"]) {
        const result = await this.group_profiles.findOneAndUpdate({ 
            _id: new ObjectId(props._id), owner_id: new ObjectId(props.user_id) 
        }, {
            $set: {
                group_description: props.group_description,
                group_name: props.group_name,
                group_profile: props.group_profile,
                updated_at: new Date()
            }
        }, { returnDocument: "after" });

        return result;
    }

    async createGroup(props: TGroupProfile["createGroupResult"]) {
        return await Promise.all([
            this.group_profiles.insertOne({
                created_at: new Date(),
                group_description: props.group_description,
                group_name: props.group_name,
                group_profile: props.group_profile,
                owner_id: new ObjectId(props.user_id),
                updated_at: new Date(),
            }),
            this.users.updateOne({ _id: new ObjectId(props.user_id) }, {
                $addToSet: { group_ids: props.user_id }
            })
        ]);
    }

    async deleteGroup(props: TGroupProfile["deleteGroup"]) {
        await Promise.all([
            this.group_chats.deleteMany({ group_id: new ObjectId(props.group_id) }),
            this.users.updateMany({ group_ids: { $in: [props.group_id] } }, {
                $pull: { group_ids: props.group_id }
            }),
            this.group_profiles.deleteOne({ _id: new ObjectId(props.group_id) })
        ]);

        return props;
    }

    async findOneGroup(id: string) {
        return await this.group_profiles.findOne({ _id: new ObjectId(id) });
    }

    async showAllGroups(props: TGroupProfile["filter"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        const currentUser = await this.users.findOne({ _id: new ObjectId(props.user_id) });
        const groupIds = currentUser?.group_ids?.map(group_id => new ObjectId(group_id));

        return await this.group_profiles.find(
            { _id: { $in: groupIds }},
            { projection: { _id: 1, group_name: 1, group_profile: 1 } }
        )
        .limit(limit)
        .skip(skip)
        .toArray();
    }

    async showGroupDetail(id: string) {
        return await this.group_profiles.findOne({ _id: new ObjectId(id) });
    }
}

const groupProfileRepository = new GroupProfileRepository();

export default groupProfileRepository;