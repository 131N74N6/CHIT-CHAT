import { t, UnwrapSchema } from "elysia";
import { ObjectId } from "mongodb";

export const userChatSchema = {
    changeMessageResult: t.Object({
        _id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid chat message" }),
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        sender_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid sender" }),
        text: t.Optional(t.String({ error: "invalid message" }))
    }),
    deleteChat: t.Object({
        message_ids: t.Array(t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid messages chat" })),
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        sender_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid sender" })
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
    filter: t.Object({
        receiver_id: t.String({ error: "invalid receiver", pattern: "^[0-9A-Fa-f]{24}$" }),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" }),
        limit: t.Number({ maximum: 54, minimum: 52, error: "maximum message each page is 54 and the minimum is 52" }),
        page: t.Number({ minimum: 1, error: "message page must start from 1" })
    }),
    hideChosenMessages: t.Object({
        message_ids: t.Array(
            t.Transform(t.String({ pattern: '^[0-9a-fA-F]{24}$', error: "invalid chat message" }))
            .Decode(value => new ObjectId(value))
            .Encode(value => value.toHexString())
        ),
        user_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid user" })
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
        files: t.Array(t.Object({
            file_name: t.String({ error: "invalid file name", minLength: 1 }),
            file_type: t.String({ error: "invalid file type", minLength: 1 }),
            public_id: t.String({ error: "invalid file", minLength: 1 }),
            resource_type: t.String({ error: "unable to get file", minLength: 1 }),
            size: t.Number({ error: "invalid file size" }),
            url: t.String({ error: "failed to access file", minLength: 1 })
        })),
        files_total: t.Number({ minimum: 0, error: "minimum files total is 0 and maximum is 20", maximum: 20 }),
        text: t.Optional(t.String({ error: "invalid message" })),
        sender_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid sender" }),
        receiver_id: t.String({ pattern: "^[0-9A-Fa-f]{24}$", error: "invalid receiver" })
    }),
    wsConfig: t.Object({
        receiver_id: t.String({ pattern: "^[0-9a-fA-F]{24}$", error: "invalid receiver" }),
        token: t.String({ minLength: 1, error: "invalid token" })
    }),
}

export type TUserChat = {
    [k in keyof typeof userChatSchema]: UnwrapSchema<typeof userChatSchema[k]>;
}