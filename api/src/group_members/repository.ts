import { ObjectId } from "mongodb";
import { db } from "../mongodb/service";
import { TGroupMember } from "./model";

class GroupMemberRepository {
    private group_members = db().collection("group_members");

    async joinGroup(data: TGroupMember["joinGroup"]) {
        const newMember = {
            joined_at: new Date(),
            group_id: data.group_id,
            profile_picture: data.profile_picture,
            user_id: data.user_id,
            username: data.username
        }

        const result = await this.group_members.insertOne(newMember);
        return { _id: result.insertedId, ...newMember }
    }

    async kickMember(data: TGroupMember["leftGroup"]) {
        return await this.group_members.deleteOne({ 
            group_id: new ObjectId(data.group_id), 
            user_id: new ObjectId(data.user_id) 
        }); 
    }

    async leftGroup(data: TGroupMember["leftGroup"]) {
        return await this.group_members.deleteOne({ 
            group_id: new ObjectId(data.group_id), 
            user_id: new ObjectId(data.user_id) 
        }); 
    }

    async showAllMembers(data: TGroupMember["filter"]) {
        const limit = data.limit;
        const page = data.page;
        const skip = (page - 1) * limit;

        return await this.group_members.find({ group_id: new ObjectId(data.group_id) })
        .limit(limit)
        .skip(skip)
        .toArray();
    }
}

const groupMemberRepository = new GroupMemberRepository();

export default groupMemberRepository;