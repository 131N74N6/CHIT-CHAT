import { t, UnwrapSchema } from "elysia"

export const userProfileSchema = {
    changeRaw: t.Object({
        address: t.Optional(t.String({ error: "invalid address", minLength: 1 })),
        description: t.Optional(t.String({ error: "invalid description", minLength: 1 })),
        gender: t.Optional(t.String({ error: "invalid gender", minLength: 1 })),
        id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" }),
        image: t.Optional(t.File({ error: "unsupported file", type: "image/*", maxSize: 8388608 })),
        name: t.Optional(t.String({ error: "invalid username", minLength: 1 })),
    }),
    changeResult: t.Object({
        address: t.Optional(t.String({ error: "invalid address", minLength: 1 })),
        description: t.Optional(t.String({ error: "invalid description", minLength: 1 })),
        gender: t.Optional(t.String({ error: "invalid gender", minLength: 1 })),
        id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" }),
        image: t.Optional(t.String({ error: "failed to access file" })),
        image_filename: t.Optional(t.String({ error: "invalid filename" })),
        image_filetype: t.Optional(t.String({ error: "invalid file type" })),
        image_public_id: t.Optional(t.String({ error: "invalid file" })),
        image_resource_type: t.Optional(t.String({ error: "undefined file" })),
        name: t.Optional(t.String({ error: "invalid username", minLength: 1 })),
    }),
    showAllUser: t.Object({
        page: t.Number({ default: 1, minimum: 1, error: "user page must start from 1" }),
        limit: t.Number({ default: 16, minimum: 16, maximum: 22, error: "maximum user data each page is 22 and the minimum is 22" })
    }),
    showUser: t.Object({
        id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" })
    })
}

export type TUserProfile = {
    [y in keyof typeof userProfileSchema]: UnwrapSchema<typeof userProfileSchema[y]>;
}