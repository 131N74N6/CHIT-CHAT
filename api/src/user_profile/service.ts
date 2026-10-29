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
        const userId = this.checkIsIdIsValid("user", props.id);
        const user = await userProfileRepository.findUserById({ id: userId });
        
        if (!user) throw new ChitChatApiError("user not found", 404);

        if (user._id.toString() !== userId) {
            throw new ChitChatApiError("you are not allowed to change", 403);
        }

        const username = props.name ? 
        this.checkIsInputIsAString("username", props.name) : (user.name || "-");

        const address = props.address ? 
        this.checkIsInputIsAString("address", props.address) : (user.address || "-");

        const description = props.description ? 
        this.checkIsInputIsAString("description", props.description) : (user.description || "-");

        const gender = props.gender ? 
        this.checkIsInputIsAString("gender", props.gender) : (user.gender || "-");

        const isNameUnchanged = !props.name || username === user.name;
        const isAddressUnchanged = !props.address || address === user.address;
        const isDescUnchanged = !props.description || description === user.description;
        const isGenderUnchanged = !props.gender || gender === user.gender;
        const isImageUnchanged = !props.image;

        if (isNameUnchanged && isAddressUnchanged && isDescUnchanged && isGenderUnchanged && isImageUnchanged) {
            return;
        }

        let imageResult: CloudinaryUploadResult = {
            file_name: user.image_filename || "-", 
            file_type: user.image_filetype || "-", 
            public_id: user.image_public_id || "-", 
            resource_type: user.image_resource_type || "-", 
            url: user.image || "-"
        };

        if (props.image) {
            const getArrayBuffer = await props.image.arrayBuffer();
            const bufferFile = Buffer.from(getArrayBuffer!);
            
            if (user.image_public_id && user.image_resource_type && user.image_public_id !== "-" && user.image_resource_type !== "-") {
                await v2.uploader.destroy(user.image_public_id, { 
                    resource_type: user.image_resource_type 
                });
            }

            imageResult = await uploadToCloudinary({
                file_buffer: bufferFile,
                foldername: "user_profile",
                mimetype: props.image.type,
                original_name: props.image.name
            });
        }

        const result = await userProfileRepository.changeUser({
            address, 
            gender, 
            id: userId, 
            description,
            image: imageResult.url,
            image_filename: imageResult.file_name,
            image_filetype: imageResult.file_type,
            image_public_id: imageResult.public_id,
            image_resource_type: imageResult.resource_type,
            name: username
        });

        // ✅ FIX: Pastikan payload yang di-emmit lengkap dan konsisten
        const forAvailableUserRoom = {
            _id: result.id, 
            name: result.name, 
            image: result.image, 
            image_public_id: result.image_public_id
        };

        const forCurrentUserProfileRoom = {
            _id: result.id, 
            name: result.name,
            address: result.address,
            gender: result.gender,
            description: result.description,
            image: result.image, 
            image_public_id: result.image_public_id,
            updated_at: new Date()
        };

        const forGroupChatRoom = { 
            _id: result.id, 
            sender_id: result.id, 
            sender_name: result.name
        }

        const forGroupMemberRoom = { 
            _id: result.id, 
            name: result.name
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

        userProfileEvent.emit(`available-user-${userId}`, { 
            data: forAvailableUserRoom, 
            type: "available-user:changed" 
        });

        userProfileEvent.emit(`current-user-profile-${userId}`, { 
            data: forCurrentUserProfileRoom, 
            type: "user-profile:changed" 
        });
    }

    async deleteUser(id: string) {
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById({ id: userId });

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (user.image_public_id && user.image_resource_type) {
            if (user.image_public_id !== "-" && user.image_resource_type!== "-" ) {
                await v2.uploader.destroy(user.image_public_id, { 
                    resource_type: user.image_resource_type 
                });
            }
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
        const user = await userProfileRepository.findUserById({ id: userId });

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (user.image_public_id && user.image_resource_type) {
            if (user.image_public_id !== "-" && user.image_resource_type!== "-" ) {
                await v2.uploader.destroy(user.image_public_id, { 
                    resource_type: user.image_resource_type 
                });
            }
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