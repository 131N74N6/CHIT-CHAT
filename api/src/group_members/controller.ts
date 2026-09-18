import { TGroupMember } from "./model";
import groupMemberService from "./service";

class GroupMemberController {
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