import { ObjectId } from "mongodb";
import { ChitChatApiError } from "../error/service";
import userProfileRepository from "./repository";
import { v2 } from "cloudinary";
import { groupMemberEvent } from "../group_members/websocket";
import { userProfileBroadcast } from "./websocket";
import { TUserProfile } from "./model";
import { uploadToCloudinary } from "../cloudinary/service";

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
        
        let newUsername = (props.name !== undefined && props.name !== "") ? 
        this.checkIsInputIsAString("username", props.name) : user.name;

        let newAddress = (props.address !== undefined && props.address !== "") ? 
        this.checkIsInputIsAString("address", props.address) : user.address;

        let newDescription = (props.description !== undefined && props.description !== "") ? 
        this.checkIsInputIsAString("description", props.description) : user.description;

        let newGender = (props.gender !== undefined && props.gender !== "") ? 
        this.checkIsInputIsAString("gender", props.gender) : user.gender;
        
        if (props.image) {
            const fileArrayBuffer = await props.image.arrayBuffer();
            const fileBuffer = Buffer.from(fileArrayBuffer);

            if (!props.image.type.includes("image")) {
                throw new ChitChatApiError("this file is not allowed", 400);
            }

            if (props.image.size > 8388608) {
                throw new ChitChatApiError("file size is too large", 400);
            }

            if (
                (user.image_public_id && user.image_resource_type) && 
                (user.image_public_id !== "-" && user.image_resource_type !== "-")
            ) {
                await v2.uploader.destroy(user.image_public_id, { resource_type: user.image_resource_type });
            }

            const newProfileImage = await uploadToCloudinary({
                file_buffer: fileBuffer,
                foldername: "user_profile",
                mimetype: props.image.type,
                original_name: props.image.name
            });
            
            await userProfileRepository.changeUser({
                id: props.id,
                address: newAddress!,
                gender: newGender!,
                description: newDescription!,
                image: newProfileImage.url,
                image_filename: newProfileImage.file_name,
                image_filetype: newProfileImage.file_type,
                image_public_id: newProfileImage.public_id,
                image_resource_type: newProfileImage.resource_type,
                name: newUsername
            });
            
            userProfileBroadcast("user-profile:changed");
        } else {
            await userProfileRepository.changeUser({
                id: props.id,
                address: newAddress!,
                gender: newGender!,
                description: newDescription!,
                image: user.image || "-",
                image_filename: user.image_filename || "-",
                image_filetype: user.image_filetype || "-",
                image_public_id: user.image_public_id || "-",
                image_resource_type: user.image_resource_type || "-",
                name: newUsername
            });

            userProfileBroadcast("user-profile:changed");
        }
    }

    async deleteUser(id: string) {
        const operations = [];
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById(userId);
        const userMessagesFiles = await userProfileRepository.findUserMessagesFiles(userId);
        const groupChatMessagesFiles = await userProfileRepository.findGroupChatMessagesFiles(userId);
        const yourGroupProfiles = await userProfileRepository.findYourGroupProfiles(userId);

        const selectedGroupChatMessagesFiles = groupChatMessagesFiles.flatMap(message => message.files || []);
        const selectedUserMessagesFiles = userMessagesFiles.flatMap(message => message.files || []);

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (
            (user.image_public_id && user.image_resource_type) && 
            (user.image_public_id !== "-" && user.image_resource_type !== "-")
        ) {
            operations.push(v2.uploader.destroy(user.image_public_id, { 
                resource_type: user.image_resource_type 
            }));
        }

        if (selectedGroupChatMessagesFiles.length > 0) {
            const removeFromCloudinary = selectedGroupChatMessagesFiles.map(messagesFile => {
                return v2.uploader.destroy(messagesFile.public_id, { 
                    resource_type: messagesFile.resource_type 
                });
            });

            operations.push(...removeFromCloudinary);
        }

        if (selectedUserMessagesFiles.length > 0) {
            const removeFromCloudinary = selectedUserMessagesFiles.map(messagesFile => {
                return v2.uploader.destroy(messagesFile.public_id, { 
                    resource_type: messagesFile.resource_type 
                });
            });

            operations.push(...removeFromCloudinary);
        }

        if (operations.length > 0) await Promise.all(operations);

        const result = await userProfileRepository.deleteUser(userId);

        if (yourGroupProfiles && yourGroupProfiles.length > 0) {
            for (const yourGroupProfile of yourGroupProfiles) {
                const groupId = this.checkIsIdIsValid("group", yourGroupProfile._id);
            
                if (yourGroupProfile.owner_id.toString() === userId) {
                    await userProfileRepository.deleteYourGroups(userId);
                } else {
                    await userProfileRepository.leftGroup(groupId);
            
                    groupMemberEvent.emit(`member-from-group-${groupId}`, { 
                        data: result, type: "member:left" 
                    });
                }
            }
        }
        
        userProfileBroadcast("user-profile:deleted");
    }

    async deleteUserProfilePicture(id: string) {
        const userId = this.checkIsIdIsValid("user", id);
        const user = await userProfileRepository.findUserById(userId);

        if (!user) throw new ChitChatApiError("user not found", 404);
        if (user._id.toString() !== userId) throw new ChitChatApiError("you are not allowed", 403);

        if (
            (user.image_public_id && user.image_resource_type) && 
            (user.image_public_id !== "-" && user.image_resource_type !== "-")
        ) {
            v2.uploader.destroy(user.image_public_id, { resource_type: user.image_resource_type });
        }

        await userProfileRepository.deleteUserProfilePicture(userId);

        userProfileBroadcast("user-profile:profile-picture-deleted");
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        return await userProfileRepository.showAllUsers({ 
            id: userId, limit: props.limit, page: props.page 
        });
    }

    async showUser(props: TUserProfile["showUser"]) {
        const userId = this.checkIsIdIsValid("user", props.id);
        return await userProfileRepository.showUser({ id: userId });
    }
}

const userProfileService = new UserProfileService();

export default userProfileService;