import { t, UnwrapSchema } from "elysia";
import { ObjectId } from "mongodb";

export const userChatSchema = {
    wsConfig: t.Object({
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        token: t.String({ minLength: 1, error: "invalid token" })
    }),
    wsPayload: t.Object({
        data: t.Any(),
        type: t.Union([
            t.Literal("message:changed"),
            t.Literal("message:deleted"),
            t.Literal("message:sent")
        ])
    }),
    executeDeletion: t.Object({
        deleteMessagePermanently: t.Array(t.Any()),
        deleteMessageTemporary: t.Array(t.Any()),
        hideMessages: t.Array(t.Any()),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" })
    }),
    executeMediaDeletion: t.Object({
        messages: t.Array(t.Any()),
        deleteFunctions: t.Function([t.Array(t.Any())], t.Promise(t.Any())),
        operations: t.Array(t.Promise(t.Any()))
    }),
    changeMessageResult: t.Object({
        _id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid chat message" }),
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        sender_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid sender" }),
        text: t.Optional(t.String({ error: "invalid message" }))
    }),
    hideChosenMessages: t.Object({
        message_ids: t.Array(
            t.Transform(t.String({ pattern: '^[0-9a-fA-F]{24}$', error: "invalid chat message" }))
            .Decode(value => new ObjectId(value))
            .Encode(value => value.toHexString())
        ),
        user_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid user" })
    }),
    deleteChat: t.Object({
        message_ids: t.Array(t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid messages chat" })),
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        sender_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid sender" })
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
        text: t.Optional(t.String({ error: "invalid message" })),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" }),
        receiver_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid receiver" })
    }),
    sendMessageResult: t.Object({
        files_total: t.Number({ minimum: 0, error: "minimum files total is 0 and maximum is 20", maximum: 20 }),
        text: t.Optional(t.String({ error: "invalid message" })),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" }),
        receiver_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid receiver" })
    }),
    messagePagination: t.Object({
        receiver_id: t.String({ error: "invalid receiver", pattern: "^[0-9A-Fa-f]{24}$" }),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" }),
        limit: t.Number({ maximum: 54, minimum: 52, error: "maximum message each page is 54 and the minimum is 52" }),
        skip: t.Number({ maximum: 54, minimum: 52, error: "maximum skipped message is 54 and the minimum is 52" }),
        page: t.Number({ minimum: 1, error: "message page must start from 1" })
    })
}

export type TUserChat = {
    [k in keyof typeof userChatSchema]: UnwrapSchema<typeof userChatSchema[k]>;
}