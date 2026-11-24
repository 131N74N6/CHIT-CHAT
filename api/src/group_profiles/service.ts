import { ObjectId } from "mongodb";
import { TGroupProfile } from "./model";
import { ChitChatApiError } from "../error/service";
import groupProfileRepository from "./repository";
import { uploadToCloudinary } from "../cloudinary/service";
import groupProfileWebSocket from "./websocket";
import { v2 } from "cloudinary";

class GroupProfileService {
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

    async changeGroup(props: TGroupProfile["changeGroupRaw"]) {
        const groupId = this.checkIsIdValid("group", props._id);
        const userId = this.checkIsIdValid("group owner", props.owner_id);
        
        const group = await groupProfileRepository.findOneGroup(groupId);
        if (!group) throw new ChitChatApiError("group not found", 404);
        
        if (group.owner_id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to change this group", 403);
        }

        const newGroupName = (props.group_name !== undefined && props.group_name !== "") ? 
        this.checkIsInputAString("group name", props.group_name) : group.group_name;
        
        const newGroupDescription = (props.group_description !== undefined && 
        props.group_description !== "") ?
        this.checkIsInputAString("group description", props.group_description) : group.group_description;

        if (props.group_profile) {
            const arrayBuffer = await props.group_profile.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);

            if (
                !props.group_profile.type.includes("application") && 
                !props.group_profile.type.includes("image") && 
                !props.group_profile.type.includes("video")
            ) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.group_profile.size > 7340032) {
                throw new ChitChatApiError("this file size is too large", 400);
            }

            if (group && group.group_profile && group.group_profile.public_id !== "-") {
                await v2.uploader.destroy(group.group_profile.public_id, { 
                    resource_type: group.group_profile.resource_type 
                });
            }

            const newProfilePicture = await uploadToCloudinary({
                file_buffer: fileBuffer,
                mimetype: props.group_profile.type,
                foldername: "room_profile",
                original_name: props.group_profile.name
            });

            await groupProfileRepository.changeGroup({
                _id: groupId,
                owner_id: userId,
                group_description: newGroupDescription || "-",
                group_name: newGroupName || "-",
                group_profile: newProfilePicture
            });

            groupProfileWebSocket.broadcast("group-profile:changed");
        } else {
            await groupProfileRepository.changeGroup({
                _id: groupId,
                owner_id: userId,
                group_description: newGroupDescription  || "-",
                group_name: newGroupName  || "-",
                group_profile: group.group_profile || "-"
            });

            groupProfileWebSocket.broadcast("group-profile:changed");
        }
    }

    async createGroup(props: TGroupProfile["createGroupRaw"]) {
        const userId = this.checkIsIdValid("group owner", props.owner_id);

        const newGroupName = (props.group_name !== undefined && props.group_name !== "") ? 
        this.checkIsInputAString("group name", props.group_name) : `group-${Date.now()}`;
        
        const newGroupDescription = (props.group_description !== undefined && 
        props.group_description !== "") ? 
        this.checkIsInputAString("group description", props.group_description) : "-";

        if (props.group_profile) {
            if (
                !props.group_profile.type.includes("application") && 
                !props.group_profile.type.includes("image") && 
                !props.group_profile.type.includes("video")
            ) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.group_profile.size > 7340032) {
                throw new ChitChatApiError("this file size is too large", 400);
            }

            const arrayBuffer = await props.group_profile.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer)

            const newProfilePicture = await uploadToCloudinary({
                file_buffer: fileBuffer,
                foldername: "room_profile",
                mimetype: props.group_profile.type,
                original_name: props.group_profile.name
            });

            await groupProfileRepository.createGroup({
                group_name: newGroupName,
                owner_id: userId,
                group_description: newGroupDescription,
                group_profile: newProfilePicture
            });
        } else {
            await groupProfileRepository.createGroup({
                group_name: newGroupName,
                owner_id: userId,
                group_description: newGroupDescription,
                group_profile: {
                    file_name: "-", 
                    file_type: "-", 
                    public_id: "-", 
                    resource_type: "-", 
                    url: "-"
                }
            });
        }
    }

    async deleteGroup(props: TGroupProfile["deleteGroup"]) {
        const operations = [];
        const groupId = this.checkIsIdValid("group", props.group_id);
        const userId = this.checkIsIdValid("group owner", props.owner_id);

        const group = await groupProfileRepository.findOneGroup(groupId);
        const groupMessages = await groupProfileRepository.findAllMessages(groupId);
        const groupMessagesFiles = groupMessages.flatMap(message => message.files || []);

        if (!group) throw new ChitChatApiError("group not found", 404);

        if (group.owner_id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to delete this group", 403);
        }

        if (group.group_profile && group.group_profile.public_id !== "-") {
            operations.push(v2.uploader.destroy(group.group_profile.public_id, {
                resource_type: group.group_profile.resource_type
            }));
        }

        if (groupMessagesFiles.length > 0) {
            const removeFromCloudinary = groupMessagesFiles.map(messagesFile => {
                return v2.uploader.destroy(messagesFile.public_id, { 
                    resource_type: messagesFile.resource_type 
                });
            });

            operations.push(...removeFromCloudinary);
        }

        if (operations.length > 0) await Promise.all(operations);

        await groupProfileRepository.deleteGroup({ group_id: groupId, owner_id: userId });

        groupProfileWebSocket.broadcast("group-profile:deleted");
    }

    async deleteGroupProfilePicture(props: TGroupProfile["deleteGroup"]) {
        const groupId = this.checkIsIdValid("group", props.group_id);
        const userId = this.checkIsIdValid("group owner", props.owner_id);
        
        const group = await groupProfileRepository.findOneGroup(groupId);
        if (!group) throw new ChitChatApiError("group not found", 404);

        if (group.owner_id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to delete this group", 403);
        }

        if (group.group_profile && group.group_profile.public_id !== "-") {
            await v2.uploader.destroy(group.group_profile.public_id, {
                resource_type: group.group_profile.resource_type
            });
        }

        await groupProfileRepository.deleteGroupProfilePicture(groupId);

        groupProfileWebSocket.broadcast("group-profile:profile-picture-deleted");
    }

    async showAllGroups(props: TGroupProfile["filter"]) {
        const userId = this.checkIsIdValid("user", props.user_id);
        return await groupProfileRepository.showAllGroups({ 
            limit: props.limit, page: props.page, user_id: userId 
        });
    }

    async showGroupDetail(id: string) {
        const groupId = this.checkIsIdValid("group", id);
        const result = await groupProfileRepository.showGroupDetail(groupId);

        if (!result) throw new ChitChatApiError("group not found", 400);
        return result;
    }
}

const groupProfileService = new GroupProfileService();

export default groupProfileService;