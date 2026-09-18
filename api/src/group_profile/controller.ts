import { TGroupProfile } from "./model";
import groupProfileService from "./service";

class GroupProfileController {
    async changeGroup(props: TGroupProfile["changeGroupRaw"]) {
        await groupProfileService.changeGroup(props);
        return { message: "group profile has changed successfully" }
    }

    async createGroup(props: TGroupProfile["createGroupRaw"]) {
        await groupProfileService.createGroup(props);
        return { message: "new group created" }
    }

    async deleteGroup(props: TGroupProfile["deleteGroup"]) {
        await groupProfileService.deleteGroup(props);
        return { message: "this group has been deleted" }
    }

    async showAllGroups(props: TGroupProfile["filter"]) {
        const result = await groupProfileService.showAllGroups(props);
        return { data: result }
    }

    async showGroupDetail(id: string) {
        const result = await groupProfileService.showGroupDetail(id);
        return { data: result }
    }
}

const groupProfileController = new GroupProfileController();

export default groupProfileController;