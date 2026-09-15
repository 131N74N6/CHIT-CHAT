import { db } from "../mongodb/service";

class GroupProfileRepository {
    private group_chats = db().collection("group_chats");
    private group_members = db().collection("group_members");

    async changeGroup() {}

    async createGroup() {}

    async deleteGroup() {}

    async showAllGroups() {}
}

const groupProfileRepository = new GroupProfileRepository();

export default groupProfileRepository;