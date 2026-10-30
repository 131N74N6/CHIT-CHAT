import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/service";
import userProfileRepository from "./repository";
import { v2 } from "cloudinary";
import { groupChatEvent } from "../group_chats/event";
import { groupMemberEvent } from "../group_members/event";
import { userProfileEvent } from "./event";
import { TUserProfile } from "./model";
import { uploadToCloudinary } from "../cloudinary/service";
import { CloudinaryUploadResult } from "../cloudinary/model";

class UserProfileService {
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

    async changeUser(props: TUserProfile["changeRaw"]) {
        const currentUserId = this.checkIsIdIsValid("user", props.id);
        const user = await userProfileRepository.findUserById(currentUserId);

        if (!user) throw new ChitChatApiError("user not found", 404);

        if (user._id.toString() !== currentUserId) {
            throw new ChitChatApiError("you are not allowed to change", 403);
        }
        
        let newUsername = user.name;
        let newAddress = user.address;
        let newDescription = user.description;
        let newGender = user.gender;
        
        if (props.name !== undefined && props.name !== "") {
            newUsername = this.checkIsInputIsAString("username", props.name);
        }
        
        if (props.gender !== undefined && props.gender !== "") {
            newGender = this.checkIsInputIsAString("gender", props.gender);
        }
        
        if (props.address !== undefined && props.address !== "") {
            newAddress = this.checkIsInputIsAString("address", props.address);
        }
        
        if (props.description !== undefined && props.description !== "") {
            newDescription = this.checkIsInputIsAString("description", props.description);
        }
        
        if (props.image) {
            const fileArrayBuffer = await props.image.arrayBuffer();
            const fileBuffer = Buffer.from(fileArrayBuffer);

            if (!props.image.type.includes("image")) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.image.size > 8388608) {
                throw new ChitChatApiError("file size is too large", 400);
            }

            if (user.image_public_id && user.image_resource_type && user.image_public_id !== "-" && user.image_resource_type !== "-") {
                await v2.uploader.destroy(user.image_public_id, { 
                    resource_type: user.image_resource_type 
                });
            }

            const newProfileImage = await uploadToCloudinary({
                file_buffer: fileBuffer,
                foldername: "user_profile",
                mimetype: props.image.type,
                original_name: props.image.name
            });
    
            await userProfileRepository.changeUser({
                id: props.id,
                address: user.address || "-" || props.address,
                gender: user.gender || "-" || props.gender,
                description: user.description || props.description || "-",
                image: newProfileImage.url,
                image_filename: newProfileImage.file_name,
                image_filetype: newProfileImage.file_type,
                image_public_id: newProfileImage.public_id,
                image_resource_type: newProfileImage.resource_type,
                name: newUsername
            });

            const forAvailableUserRoom = {
                _id: currentUserId, 
                name: newUsername, 
                image: newProfileImage.url, 
                image_public_id: newProfileImage.public_id
            };

            const forCurrentUserProfileRoom = {
                _id: currentUserId, 
                name: newUsername,
                address: newAddress,
                gender: newGender,
                description: newDescription,
                image: newProfileImage.url, 
                image_public_id: newProfileImage.public_id,
                updated_at: new Date()
            };

            const forGroupChatRoom = { 
                _id: currentUserId, 
                sender_id: currentUserId, 
                sender_name: newUsername
            }

            const forGroupMemberRoom = { 
                _id: currentUserId, 
                name: newUsername
            }

            if (user.group_ids && user.group_ids.length > 0) {
                user.group_ids.map((group_id) => {
                    const room = `member-from-group-${group_id.toString()}`;
                    groupChatEvent.emit(group_id.toString(), { 
                        data: forGroupChatRoom, type: "group-message-owner:changed" 
                    });
                    groupMemberEvent.emit(room, { data: forGroupMemberRoom, type: "member-profile:changed" });
                });
            }

            userProfileEvent.emit(`available-user-${currentUserId}`, { 
                data: forAvailableUserRoom, 
                type: "available-user:changed" 
            });

            userProfileEvent.emit(`current-user-profile-${currentUserId}`, { 
                data: forCurrentUserProfileRoom, 
                type: "user-profile:changed" 
            });
        } else {
            await userProfileRepository.changeUser({
                id: props.id,
                address: user.address || "-" || props.address,
                gender: user.gender || "-" || props.gender,
                description: user.description || props.description || "-",
                image: user.image || "-",
                image_filename: user.image_filename || "-",
                image_filetype: user.image_filetype || "-",
                image_public_id: user.image_public_id || "-",
                image_resource_type: user.image_resource_type || "-",
                name: props.name
            });

            const forAvailableUserRoom = {
                _id: currentUserId, 
                name: newUsername, 
                image: user.image || "-", 
                image_public_id: user.image_public_id || "-"
            };

            const forCurrentUserProfileRoom = {
                _id: currentUserId, 
                name: newUsername,
                address: newAddress,
                gender: newGender,
                description: newDescription,
                image: user.image || "-", 
                image_public_id: user.image_public_id || "-",
                updated_at: new Date()
            };

            const forGroupChatRoom = { 
                _id: currentUserId, 
                sender_id: currentUserId, 
                sender_name: newUsername
            }

            const forGroupMemberRoom = { 
                _id: currentUserId, 
                name: newUsername
            }

            if (user.group_ids && user.group_ids.length > 0) {
                user.group_ids.map((group_id) => {
                    const room = `member-from-group-${group_id.toString()}`;
                    groupChatEvent.emit(group_id.toString(), { 
                        data: forGroupChatRoom, type: "group-message-owner:changed" 
                    });
                    groupMemberEvent.emit(room, { data: forGroupMemberRoom, type: "member-profile:changed" });
                });
            }

            userProfileEvent.emit(`available-user-${currentUserId}`, { 
                data: forAvailableUserRoom, 
                type: "available-user:changed" 
            });

            userProfileEvent.emit(`current-user-profile-${currentUserId}`, { 
                data: forCurrentUserProfileRoom, 
                type: "user-profile:changed" 
            });
        }
    }

    async deleteUser(id: string) {
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById(userId);

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (user.image_public_id && user.image_resource_type && user.image_public_id !== "-" && user.image_resource_type !== "-") {
            await v2.uploader.destroy(user.image_public_id, { 
                resource_type: user.image_resource_type 
            });
        }

        const result = await userProfileRepository.deleteUser(userId);
        const availableUserRoom = `available-user-${userId}`;
        const currentUserProfileRoom = `current-user-profile-${userId}`;

        if (user.group_ids && user.group_ids.length > 0) {
            user.group_ids.map((group_id) => {
                const room = `member-from-group-${group_id}`;
                groupChatEvent.emit(group_id, { data: result, type: "group-message-owner:deleted" });
                groupMemberEvent.emit(room, { data: result, type: "member:left" });
            });
        }

        userProfileEvent.emit(availableUserRoom, { data: result, type: "available-user:deleted" });
        userProfileEvent.emit(currentUserProfileRoom, { data: result, type: "user-profile:deleted" });
    }

    async deleteUserProfilePicture(id: string) {
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById(userId);

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (user.image_public_id && user.image_resource_type && user.image_public_id !== "-" && user.image_resource_type !== "-") {
            await v2.uploader.destroy(user.image_public_id, { 
                resource_type: user.image_resource_type 
            });
        }

        const result = await userProfileRepository.deleteUserProfilePicture(userId);
        const availableUserRoom = `available-user-${userId}`;
        const currentUserProfileRoom = `current-user-profile-${userId}`;

        const broadcastedData = {
            _id: result?._id,
            image: result?.image,
            image_public_id: result?.image_public_id,
        }

        if (user.group_ids && user.group_ids.length > 0) {
            user.group_ids.map((group_id) => {
                const room = `member-from-group-${group_id}`;
                groupMemberEvent.emit(room, { data: broadcastedData, type: "member-profile-picture:deleted" });
            });
        }

        userProfileEvent.emit(availableUserRoom, { data: broadcastedData, type: "available-user-profile-picture:deleted" });
        userProfileEvent.emit(currentUserProfileRoom, { data: broadcastedData, type: "user-profile-picture:deleted" });
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        return await userProfileRepository.showAllUsers({ id: userId, limit: props.limit, page: props.page });
    }

    async showUser(props: TUserProfile["showUser"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        return await userProfileRepository.showUser({ id: userId });
    }
}

const userProfileService = new UserProfileService();

export default userProfileService;