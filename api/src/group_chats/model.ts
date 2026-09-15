import { t, UnwrapSchema } from "elysia";
import { ObjectId } from "mongodb";

export const groupChatSchema = {
    additionalFilter: t.Object({
        group_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid group" }),
        limit: t.Number({ maximum: 54, minimum: 52, error: "maximum message each page is 54 and the minimum is 52" }),
        sender_id: t.String({ error: "invalid sender", pattern: "^[0-9A-Fa-f]{24}$" }),
        skip: t.Number({ maximum: 54, minimum: 52, error: "maximum skipped message is 54 and the minimum is 52" }),
        page: t.Number({ minimum: 1, error: "message page must start from 1" })
    }),
    changeMessage: t.Object({
        _id: t.String({ error: "invalid chat message", pattern: "^[0-9A-Fa-f]{24}$" }),
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        sender_id: t.String({ error: "invalid sender", pattern: "^[0-9A-Fa-f]{24}$" }),
        text: t.Optional(t.String({ error: "invalid message" }))
    }),
    deleteMessage: t.Object({
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-F-af]{24}$" }),
        message_ids: t.Array(t.String({ error: "invalid chat message", pattern: "^[0-9A-F-af]{24}$" })),
        sender_id: t.String({ error: "invalid sender", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    executeDeletion: t.Object({
        deleteMessagesPermanently: t.Array(t.Any()),
        deleteMessagesTemporary: t.Array(t.Any()),
        hideMessages: t.Array(t.Any()),
        sender_id: t.String({ error: "invalid sender", pattern: "^[0-9A-Fa-f]{24}$" })
    }),
    executeMediaDeletion: t.Object({
        deleteFunction: t.Function([t.Array(t.Any())], t.Promise(t.Any())),
        messages: t.Array(t.Any()),
        operations: t.Array(t.Promise(t.Any()))
    }),
    hideChosenMessages: t.Object({
        message_ids: t.Array(
            t.Transform(t.String({ pattern: '^[0-9a-fA-F]{24}$', error: "invalid chat message" }))
            .Decode(value => new ObjectId(value))
            .Encode(value => value.toHexString())
        ),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" })
    }),
    sendMessageResult: t.Object({
        files_total: t.Number({ minimum: 0, error: "minimum files total is 0 and maximum is 20", maximum: 20 }),
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        group_name: t.String({ error: "invalid group name", minLength: 1 }),
        sender_id: t.String({ error: "invalid sender", pattern: "^[0-9A-Fa-f]{24}$" }),
        sender_name: t.String({ error: "invalid sender name" }),
        text: t.Optional(t.String({ error: "invalid message" }))
    }),
    sendMessageRaw: t.Object({
        files: t.Optional(t.Union([
            t.File({
                maxSize: 8 * 1024 * 1024, 
                type: ["image/*", "video/*", "application/*"], error: "unsupported file"
            }),
            t.Array(t.File({
                maxSize: 8 * 1024 * 1024, 
                type: ["image/*", "video/*", "application/*"], error: "unsupported file"
            }))
        ])),
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        group_name: t.String({ error: "invalid group name", minLength: 1 }),
        sender_id: t.String({ error: "invalid sender" }),
        sender_name: t.String({ error: "invalid sender name" }),
        text: t.Optional(t.String({ error: "invalid message" }))
    }),
    wsConfig: t.Object({
        group_id: t.String({ error: "invalid group", pattern: "^[0-9A-Fa-f]{24}$" }),
        token: t.String({ minLength: 1, error: "invalid token" })
    }),
    wsPayload: t.Object({
        data: t.Any(),
        type: t.Union([
            t.Literal("group-message:changed"), 
            t.Literal("group-message:deleted"), 
            t.Literal("group-message:sent")
        ])
    })
}

export type TGroupChats = {
    [r in keyof typeof groupChatSchema]: UnwrapSchema<typeof groupChatSchema[r]>;
}