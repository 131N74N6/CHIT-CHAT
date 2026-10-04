import { TGroupMember } from "./model";
import groupMemberService from "./service";

class GroupMemberController {
    async isGroupOwner(group_id: string, user_id: string) {
        const isOwner = await groupMemberService.isGroupOwner(group_id, user_id);
        return { data: isOwner }
    }
    async joinGroup(data: TGroupMember["joinGroup"]) {
        await groupMemberService.joinGroup(data);
        return { message: "successfully joined a group" }
    }

    async kickMember(data: TGroupMember["leftGroup"]) {
        await groupMemberService.kickMember(data);
        return { message: "successfully kicked member" }
    }

    async leftGroup(data: TGroupMember["leftGroup"]) {
        await groupMemberService.leftGroup(data);
        return { message: "successfully left a group" }
    }

    async showAllMembers(data: TGroupMember["filter"]) {
        const members = await groupMemberService.showAllMembers(data);
        return { data: members }
    }
}

const groupMemberController = new GroupMemberController();

export default groupMemberController;