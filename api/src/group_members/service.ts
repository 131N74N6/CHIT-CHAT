import { ObjectId } from "mongodb";
import { TGroupMember } from "./model";
import { ChitChatApiError } from "../error/handler";
import groupMemberRepository from "./repository";
import { groupMemberEvent } from "./event";

class GroupMemberService {
    private checkIsIdValid(field: string, value: unknown) {
        if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }

    private checkIsInputAString(field: string, value: unknown) {
        if (!value || typeof value !== "string" || value === "") {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }

    async joinGroup(data: TGroupMember["joinGroup"]) {
        let profilePicture: string = "";

        const groupId = this.checkIsIdValid("group", data.group_id);
        const roomId = `member-from-group-${groupId}`;
        const userId = this.checkIsIdValid("group", data.user_id);
        const username = this.checkIsInputAString("username", data.username);

        if (data.profile_picture && data.profile_picture !== null && data.profile_picture !== undefined) {
            profilePicture = this.checkIsInputAString("profile picture", data.profile_picture);
        }

        const result = await groupMemberRepository.joinGroup({
            group_id: groupId, user_id: userId, username: username, profile_picture: profilePicture
        });

        groupMemberEvent.emit(roomId, { data: result, type: "member:joined" });
    }

    async kickMember(data: TGroupMember["leftGroup"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const roomId = `member-from-group-${groupId}`;
        const userId = this.checkIsIdValid("group", data.user_id);

        await groupMemberRepository.kickMember({ group_id: groupId, user_id: userId });
        groupMemberEvent.emit(roomId, { data: userId, type: "member:kicked" });
    }

    async leftGroup(data: TGroupMember["leftGroup"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);
        const roomId = `member-from-group-${groupId}`;
        const userId = this.checkIsIdValid("group", data.user_id);

        await groupMemberRepository.leftGroup({ group_id: groupId, user_id: userId });
        groupMemberEvent.emit(roomId, { data: userId, type: "member:left" });
    }

    async showAllMembers(data: TGroupMember["filter"]) {
        const groupId = this.checkIsIdValid("group", data.group_id);

        return await groupMemberRepository.showAllMembers({ 
            group_id: groupId, page: data.page, limit: data.limit 
        });
    }
}

const groupMemberService = new GroupMemberService();

export default groupMemberService;