import { TUserProfile } from "./model";
import userProfileService from "./service";

class UserProfileController {
    async changeUser(props: TUserProfile["changeRaw"]) {
        await userProfileService.changeUser(props);
        return { message: "profile has changed" }
    }

    async deleteUser(id: string) {
        await userProfileService.deleteUser(id);
        return { message: "user has deleted this account" }
    }

    async deleteUserProfilePicture(id: string) {
        await userProfileService.deleteUserProfilePicture(id);
        return { message: "profile picture removed" }
    }

    async showAllUsers(props: TUserProfile["showAllUser"]) {
        const result = await userProfileService.showAllUsers(props);
        return { data: result }
    }

    async showUser(props: TUserProfile["showUser"]) {
        const result = await userProfileService.showUser(props);
        return { data: result }
    }
}

const userProfileController = new UserProfileController();

export default userProfileController;