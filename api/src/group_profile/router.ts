import Elysia, { t } from "elysia";
import { apiAuthMiddleware } from "../auth/middleware";
import groupProfileController from "./controller";
import { groupProfileSchema, TGroupProfile } from "./model";
import { createGroupProfileErrorStream, createGroupProfileSSEStream, groupProfileSSEHeaders } from "./sse";
import { authServiceApi } from "../auth/service";

const groupProfileRouters = new Elysia({ prefix: "/api/v1/groups" })
.use(apiAuthMiddleware)
.delete("/", async (context) => {
    return await groupProfileController.deleteGroup({ 
        group_id: context.query.group_id, owner_id: context.user.id
    });
}, {
    query: t.Pick(groupProfileSchema.deleteGroup, ["group_id"])
})
.get("/sse/:group_id", async (context) => {
    const session = await authServiceApi.api.getSession({ headers: context.request.headers });
    if (!session) return new Response(createGroupProfileErrorStream(), { headers: groupProfileSSEHeaders });

    const stream = createGroupProfileSSEStream(context.params.group_id, session.user.id);
    return new Response(stream, { headers: groupProfileSSEHeaders });
}, {
    params: t.Pick(groupProfileSchema.deleteGroup, ["group_id"])
})
.get("/", async (context) => {
    return await groupProfileController.showAllGroups({ ...context.query, user_id: context.user.id });
}, {
    query: t.Omit(groupProfileSchema.filter, ["user_id"])
})
.get("/:_id", async (context) => {
    return await groupProfileController.showGroupDetail(context.params._id);
}, {
    params: t.Pick(groupProfileSchema.changeGroupRaw, ["_id"])
})
.post("/", async (context) => {
    return await groupProfileController.createGroup({ 
        group_description: context.body.group_description,
        group_name: context.body.group_name,
        group_profile: context.body.group_profile,
        owner_id: context.user.id 
    });
}, {
    body: t.Omit(groupProfileSchema.createGroupRaw, ["owner_id"])
})
.put("/", async (context) => {
    return await groupProfileController.changeGroup({
        _id: context.body._id, 
        group_description: context.body.group_description,
        group_name: context.body.group_name,
        group_profile: context.body.group_profile,
        owner_id: context.user.id, 
    });
}, {
    body: t.Omit(groupProfileSchema.changeGroupRaw, ["owner_id"])
})
.put("/:_id", async (context) => {
    return await groupProfileController.deleteGroupProfilePicture({ 
        group_id: context.params._id, owner_id: context.user.id 
    });
}, {
    params: t.Pick(groupProfileSchema.changeGroupRaw, ["_id"])
});

export default groupProfileRouters;