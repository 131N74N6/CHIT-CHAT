import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupMember } from "./model";
import { User } from "../auth/model";

class GroupMemberRepository {
    private users = db().collection<Omit<User, "id">>("user");

    async joinGroup(props: TGroupMember["joinGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(props.user_id) }, {
            $addToSet: { group_ids: props.group_id }
        });

        return props.group_id;
    }

    async kickMember(props: TGroupMember["leftGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(props.user_id) }, {
            $pull: { group_ids: [props.group_id] }
        });

        return props.user_id;
    }

    async leftGroup(props: TGroupMember["leftGroup"]) {
        await this.users.updateOne({ _id: new ObjectId(props.user_id) }, {
            $pull: { group_ids: [props.group_id] }
        });

        return props.user_id;
    }

    async showAllMembers(props: TGroupMember["filter"]) {
        const limit = props.limit;
        const page = props.page;
        const skip = (page - 1) * limit;

        return await this.users.find(
            { group_ids: { $in: [props.group_id] } },
            { projection: { _id: 1, image: 1, name: 1 } }
        )
        .limit(limit)
        .skip(skip)
        .toArray();
    }
}

const groupMemberRepository = new GroupMemberRepository();

export default groupMemberRepository;