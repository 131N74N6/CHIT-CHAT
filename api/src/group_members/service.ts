import { ObjectId } from "mongodb";
import { TGroupMember } from "./model";
import { ChitChatApiError } from "../error/service";
import groupMemberRepository from "./repository";
import groupMemberWebSocket from "./websocket";

class GroupMemberService {
    private checkIsIdValid(field: string, value: unknown) {
        if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }

    async joinGroup(data: TGroupMember["joinGroup"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const userId = this.checkIsIdValid("group", data.user_id);

        await groupMemberRepository.joinGroup({ group_id: groupId, user_id: userId });
        groupMemberWebSocket.broadcast("member:joined");
    }

    async kickMember(data: TGroupMember["leftGroup"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const userId = this.checkIsIdValid("group", data.user_id);

        await groupMemberRepository.kickMember({ group_id: groupId, user_id: userId });
        groupMemberWebSocket.broadcast("member:kicked");
    }

    async leftGroup(data: TGroupMember["leftGroup"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const userId = this.checkIsIdValid("group", data.user_id);

        await groupMemberRepository.leftGroup({ group_id: groupId, user_id: userId });
        groupMemberWebSocket.broadcast("member:left");
    }

    async showAllMembers(data: TGroupMember["filter"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);

        if (data.name === "" || data.name === undefined) {
            return await groupMemberRepository.showAllMembers({ 
                group_id: groupId, page: data.page, limit: data.limit
            });
        } else {
            return await groupMemberRepository.showAllMembers({ 
                group_id: groupId, page: data.page, limit: data.limit, name: data.name 
            });
        }
    }
}

const groupMemberService = new GroupMemberService();

export default groupMemberService;