import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupMember } from "./model";
import { User } from "../auth/model";

class GroupMemberRepository {
    private users = db().collection<Omit<User, "id">>("user");

    async joinGroup(data: TGroupMember["joinGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(data.user_id) }, {
            $addToSet: { group_ids: data.group_id }
        });

        return data.group_id;
    }

    async kickMember(data: TGroupMember["leftGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(data.user_id) }, {
            $pull: { group_ids: [data.group_id] }
        });

        return data.user_id;
    }

    async leftGroup(data: TGroupMember["leftGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(data.user_id) }, {
            $pull: { group_ids: [data.group_id] }
        });

        return data.user_id;
    }

    async showAllMembers(data: TGroupMember["filter"]) {
        const limit = data.limit;
        const page = data.page;
        const skip = (page - 1) * limit;

        return await this.users.find({ group_ids: { $in: [data.group_id] } })
        .limit(limit)
        .skip(skip)
        .toArray();
    }
}

const groupMemberRepository = new GroupMemberRepository();

export default groupMemberRepository;