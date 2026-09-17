import { t, UnwrapSchema } from "elysia";
import { ObjectId } from "mongodb";

export const groupMemberSchema = {
    filter: t.Object({
        group_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid group" }),
        limit: t.Number({ maximum: 32, minimum: 28, error: "maximum member each page is 32 and the minimum is 28" }),
        page: t.Number({ minimum: 1, error: "member page must start from 1" }),
    }),
    joinGroup: t.Object({
        group_id: t.String({ pattern: '^[0-9a-fA-F]{24}$', error: "invalid group" }),
        user_id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    leftGroup: t.Object({
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        user_id: t.String({ error: "invalid user", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    wsConfig: t.Object({
        group_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid group" }),
        token: t.String({ minLength: 1, error: "invalid token" })
    }),
    wsPayload: t.Object({
        data: t.Any(),
        type: t.Union([
            t.Literal("member:joined"),
            t.Literal("member:left"),
            t.Literal("member:kicked")
        ])
    }),
}

export type TGroupMember = {
    [a in keyof typeof groupMemberSchema]: UnwrapSchema<typeof groupMemberSchema[a]>;
}