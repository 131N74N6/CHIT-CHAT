import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/handler";
import userProfileRepository from "./repository";
import { v2 } from "cloudinary";
import { groupChatEvent } from "../group_chats/event";
import { groupMemberEvent } from "../group_members/event";
import { userChatEvent } from "../user_chats/event";
import { userProfileEvent } from "./event";
import { TUserProfile } from "./model";
import { CloudinaryUploadResult } from "../cloudinary/model";
import { uploadToCloudinary } from "../cloudinary/service";

class UserProfileService {
    async changeUser(props: TUserProfile["changeRaw"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        let username = "";
        let description = "";
        
        const user = await userProfileRepository.findUserById({ id: userId });
        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (props.name) username = this.checkIsInputIsAString("username", props.name);
        if (props.description) description = this.checkIsInputIsAString("description", props.description);

        let image: CloudinaryUploadResult = {
            file_name: "", 
            file_type: "", 
            public_id: "", 
            resource_type: "", 
            size: 0, 
            url: ""
        }

        if (username === user.name && 
            description === user.description && 
            user.image_filename === image.file_name
        ) return;

        if (props.image) {
            const getArrayBuffer = await props.image.arrayBuffer();
            const bufferFile = Buffer.from(getArrayBuffer!);
            
            if (user.image_public_id && user.image_resource_type) {
                if (user.image_public_id !== "" && user.image_resource_type!== "" ) {
                    await v2.uploader.destroy(user.image_public_id, { 
                        resource_type: user.image_resource_type 
                    });
                }
            }

            image = await uploadToCloudinary({
                file_buffer: bufferFile,
                foldername: "user_profile",
                mimetype: props.image?.type!,
                original_name: props.image?.name!,
                size: props.image?.size!
            });
        }

        const result = await userProfileRepository.changeUser({
            id: userId,
            description: description,
            image: image.url,
            image_filename: image.file_name,
            image_filetype: image.file_type,
            image_public_id: image.public_id,
            image_resource_type: image.resource_type,
            name: username
        });

        const availableUserRoom = `available-user-${userId}`;
        const currentUserProfileRoom = `current-user-profile-${userId}`;

        const forAvailableUserRoom = {
            _id: result.id, 
            name: result.name, 
            image: result.image, 
            image_public_id: result.image_public_id
        }

        const forCurrentUserProfileRoom = {
            _id: result.id, 
            description: result.description,
            name: result.name, 
            image: result.image, 
            image_public_id: result.image_public_id,
            updated_at: new Date()
        }

        const forGroupChatRoom = { 
            image: result.image, 
            image_public_id: result.image_public_id,
            sender_id: result.id, 
            sender_name: result.name
        }

        const forGroupMemberRoom = { 
            sender_id: result.id, 
            sender_name: result.name
        }

        if (user.group_ids && user.group_ids.length > 0) {
            user.group_ids.map((group_id) => {
                const room = `member-from-group-${group_id.toString()}`;
                groupChatEvent.emit(group_id.toString(), { data: forGroupChatRoom, type: "group-message:changed" });
                groupMemberEvent.emit(room, { data: forGroupMemberRoom, type: "member:changed" });
            });
        }

        userProfileEvent.emit(availableUserRoom, { 
            data: forAvailableUserRoom, 
            type: "available-user:changed" 
        });

        userProfileEvent.emit(currentUserProfileRoom, { 
            data: forCurrentUserProfileRoom, 
            type: "user-profile:changed" 
        });
    }
    
    private checkIsIdIsValid(field: string, value: unknown) {
        if (!value || typeof value !== "string" || !ObjectId.isValid(value)) {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }
    
    private checkIsInputIsAString(field: string, value: unknown) {
        if (!value || typeof value !== "string") {
            throw new ChitChatApiError(`invalid ${field}`, 400);
        }

        return value;
    }

    async deleteUser(id: string) {
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById({ id: userId });

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (user.image_public_id && user.image_resource_type) {
            if (user.image_public_id !== "" && user.image_resource_type!== "" ) {
                await v2.uploader.destroy(user.image_public_id, { 
                    resource_type: user.image_resource_type 
                });
            }
        }

        const result = await userProfileRepository.deleteUser(userId);
        const room1 = `current-user-profile-${userId}`;
        const room2 = `available-user-${userId}`;
        const room3 = `user-chat-${userId}`;

        if (user.group_ids && user.group_ids.length > 0) {
            user.group_ids.map((group_id) => {
                const room = `member-from-group-${group_id}`;
                groupChatEvent.emit(group_id, { data: result, type: "group-message:deleted" });
                groupMemberEvent.emit(room, { data: result, type: "member:left" });
            });
        }

        userChatEvent.emit(room3, { data: result, type: "user-message:deleted" });
        userProfileEvent.emit(room1, { data: result, type: "available-user:changed:deleted" });
        userProfileEvent.emit(room2, { data: result, type: "user-profile:deleted" });
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        return await userProfileRepository.showAllUsers(props);
    }

    async showUser(props: TUserProfile["showUser"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        return await userProfileRepository.showUser({ id: userId });
    }
}

const userProfileService = new UserProfileService();

export default userProfileService;