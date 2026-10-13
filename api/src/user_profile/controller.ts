import { TUserProfile } from "./model";
import userProfileService from "./service";

class UserProfileController {
    async changeUser(props: TUserProfile["changeRaw"]) {
        await userProfileService.changeUser(props);
    }

    async deleteUser(id: string) {
        await userProfileService.deleteUser(id);
    }

    async deleteUserProfilePicture(id: string) {
        await userProfileService.deleteUserProfilePicture(id);
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