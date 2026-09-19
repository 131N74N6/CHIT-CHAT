import { TUserProfile } from "./model";
import userProfileService from "./service";

class UserProfileController {
    async changeUser(props: TUserProfile["changeRaw"]) {
        await userProfileService.changeUser(props);
        return { message: "your profile has been changed successfully" }
    }

    async deleteUser(id: string) {
        await userProfileService.deleteUser(id);
        return { message: "your profile has been deleted successfully" }
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