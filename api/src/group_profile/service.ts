import { ObjectId } from "mongodb";
import { TGroupProfile } from "./model";
import { ChitChatApiError } from "../error/handler";
import groupProfileRepository from "./repository";
import { uploadToCloudinary } from "../cloudinary/service";
import { groupProfileEvent } from "./event";
import { groupChatEvent } from "../group_chats/event";
import { v2 } from "cloudinary";
import { CloudinaryUploadResult } from "../cloudinary/model";

const allowedFileType = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxFileSize = 7340032;

class GroupProfileService {
    async changeGroup(props: TGroupProfile["changeGroupRaw"]) {
        const groupId = this.checkIsIdValid("group", props._id);
        const userId = this.checkIsIdValid("group owner", props.user_id);
        const room1 = `group-profile-${groupId}`;
        const room2 = `joined-group-${userId}`;

        let newDescription = "";
        let newName = "";

        let newProfilePicture: CloudinaryUploadResult = {
            file_name: "", 
            file_type: "", 
            public_id: "", 
            resource_type: "", 
            size: 0, 
            url: ""
        }

        const group = await groupProfileRepository.findOneGroup(groupId);
        if (!group) throw new ChitChatApiError("group not found", 404);

        if (group.owner_id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to change this group", 403);
        }
        
        const stillSame = group.group_name === newName && 
        group.group_description === newDescription && 
        (group.group_profile === null || group.group_profile?.group_name === props.group_profile?.name);

        if (props.group_description) {
            newDescription = this.checkIsInputAString("group descripton", props.group_description);
        }

        if (props.group_name) {
            newName = this.checkIsInputAString("group name", props.group_name);
        }

        if (stillSame) return;

        if (props.group_profile) {
            const arrayBuffer = await props.group_profile.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer);

            if (!allowedFileType.includes(props.group_profile.type)) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.group_profile.size > maxFileSize) {
                throw new ChitChatApiError("this file size is too large", 400);
            }

            if (group && group.group_profile && group.group_profile.public_id) {
                await v2.uploader.destroy(group.group_profile.public_id, { 
                    resource_type: group.group_profile.resource_type 
                });
            }

            newProfilePicture = await uploadToCloudinary({
                file_buffer: fileBuffer,
                mimetype: props.group_profile.type,
                foldername: "room_profile",
                original_name: props.group_profile.name,
                size: props.group_profile.size
            });
        }

        const result = await groupProfileRepository.changeGroup({
            _id: groupId,
            user_id: userId,
            group_description: newDescription,
            group_name: newName,
            group_profile: newProfilePicture
        });

        const sendToRoom1 = {
            _id: groupId,
            group_description: result?.group_description,
            group_name: result?.group_name,
            group_profile: result?.group_profile
        };

        const sendToRoom2 = {
            _id: groupId,
            group_name: result?.group_name,
            group_profile: result?.group_profile
        };

        groupProfileEvent.emit(room1, { data: sendToRoom1, type: "group:changed" });
        groupChatEvent.emit(room2, { data: sendToRoom2, type: "group:changed" });
    }

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

    async createGroup(props: TGroupProfile["createGroupRaw"]) {
        const groupName = this.checkIsInputAString("group name", props.group_name);
        const userId = this.checkIsIdValid("group owner", props.user_id);
        
        let newDescription = "";

        let newProfilePicture: CloudinaryUploadResult = {
            file_name: "", 
            file_type: "", 
            public_id: "", 
            resource_type: "", 
            size: 0, 
            url: ""
        }

        if (props.group_description) {
            newDescription = this.checkIsInputAString("group name", props.group_description);
        }

        if (props.group_profile) {
            if (!allowedFileType.includes(props.group_profile.type)) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.group_profile.size > maxFileSize) {
                throw new ChitChatApiError("this file size is too large", 400);
            }

            const arrayBuffer = await props.group_profile.arrayBuffer();
            const fileBuffer = Buffer.from(arrayBuffer)

            newProfilePicture = await uploadToCloudinary({
                file_buffer: fileBuffer,
                foldername: "room_profile",
                mimetype: props.group_profile.type,
                original_name: props.group_profile.name,
                size: props.group_profile.size
            });
        }

        await groupProfileRepository.createGroup({
            group_name: groupName,
            user_id: userId,
            group_description: newDescription,
            group_profile: newProfilePicture
        });
    }

    async deleteGroup(props: TGroupProfile["deleteGroup"]) {
        const groupId = this.checkIsIdValid("group", props.group_id);
        const userId = this.checkIsIdValid("group owner", props.user_id);

        const room1 = `group-profile-${groupId}`;
        const room2 = `joined-group-${userId}`;

        const group = await groupProfileRepository.findOneGroup(groupId);
        if (!group) throw new ChitChatApiError("group not found", 404);

        if (group.owner_id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to delete this group", 403);
        }

        if (group.group_profile && group.group_profile.public_id) {
            await v2.uploader.destroy(group.group_profile.public_id, {
                resource_type: group.group_profile.resource_type
            });
        }

        await groupProfileRepository.deleteGroup({ group_id: groupId, user_id: userId });

        const result = await groupProfileRepository.deleteGroup({ group_id: groupId, user_id: userId});
        groupChatEvent.emit(room1, { data: result.group_id, type: "group:deleted" });
        groupChatEvent.emit(room2, { data: result.group_id, type: "group:deleted" });
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