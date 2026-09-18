import { t, UnwrapSchema } from "elysia";

export const groupProfile = {
    changeGroupRaw: t.Object({
        _id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        group_description: t.Optional(t.String({ error: "invalid group description", minLength: 1 })),
        group_name: t.Optional(t.String({ error: "invalid group name", minLength: 1 })),
        group_profile: t.Optional(t.Union([
            t.File({ error: "unsupported file", type: "image/*", maxSize: 7340032 }),
            t.Null()
        ])),
        user_id: t.String({ error: "invalid group owner", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    changeGroupResult: t.Object({
        _id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        group_description: t.Optional(t.String({ error: "invalid group description", minLength: 1 })),
        group_name: t.Optional(t.String({ error: "invalid group name", minLength: 1 })),
        group_profile: t.Optional(t.Union([
            t.Null(),
            t.Object({
                file_name: t.String({ error: "invalid file name", minLength: 1 }),
                file_type: t.String({ error: "invalid file type", minLength: 1 }),
                public_id: t.String({ error: "invalid file", minLength: 1 }),
                resource_type: t.String({ error: "unable to get file", minLength: 1 }),
                size: t.Number({ error: "invalid file size" }),
                url: t.String({ error: "failed to access file", minLength: 1 })
            })
        ])),
        user_id: t.String({ error: "invalid group owner", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    createGroupRaw: t.Object({
        group_description: t.Optional(t.String({ error: "invalid group description", minLength: 1 })),
        group_name: t.String({ error: "invalid group name", minLength: 1 }),
        group_profile: t.Optional(t.Union([
            t.File({ error: "unsupported file", type: "image/*", maxSize: 7340032 }),
            t.Null()
        ])),
        user_id: t.String({ error: "invalid owner", pattern: "^[0-9A-Fa-f]{24}$" }),
    }),
    createGroupResult: t.Object({
        group_description: t.Optional(t.String({ error: "invalid group description", minLength: 1 })),
        group_name: t.String({ error: "invalid group name", minLength: 1 }),
        group_profile: t.Optional(t.Union([
            t.Null(),
            t.Object({
                file_name: t.String({ error: "invalid file name", minLength: 1 }),
                file_type: t.String({ error: "invalid file type", minLength: 1 }),
                public_id: t.String({ error: "invalid file", minLength: 1 }),
                resource_type: t.String({ error: "unable to get file", minLength: 1 }),
                size: t.Number({ error: "invalid file size" }),
                url: t.String({ error: "failed to access file", minLength: 1 })
            })
        ])),
        user_id: t.String({ error: "invalid group owner", pattern: "^[0-9A-Fa-f]{24}$" }),
    }),
    deleteGroup: t.Object({
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        user_id: t.String({ error: "invalid group owner", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    filter: t.Object({
        limit: t.Number({ maximum: 32, minimum: 28, error: "maximum group profile each page is 32 and the minimum is 28" }),
        page: t.Number({ minimum: 1, error: "group profile page must start from 1" }),
        user_id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    wsConfig: t.Object({
        group_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid group" }),
        token: t.String({ minLength: 1, error: "invalid token" })
    }),
    wsPayload: t.Object({
        data: t.Any(),
        type: t.Union([ t.Literal("group:changed"), t.Literal("group:deleted") ])
    })
}

export type TGroupProfile = {
    [o in keyof typeof groupProfile]: UnwrapSchema<typeof groupProfile[o]>;
}