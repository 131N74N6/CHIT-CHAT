import { t, UnwrapSchema } from "elysia"
import { ObjectId } from "mongodb"

export const chatBotSchema = {
    filter: t.Object({
        limit: t.Number({ maximum: 32, minimum: 28, error: "maximum chatbot result each page is 32 and the minimum is 28" }),
        page: t.Number({ minimum: 1, error: "chatbot result page must start from 1" }),
        user_id: t.String({ error: "invalid user", pattern: "^[0-0A-Fa-f]{24}$" })
    }),
    questionAndAnswer: t.Object({
        role: t.Union([t.Literal("user/human"), t.Literal("ai/bot")]),
        question: t.Optional(t.String({ error: "invalid question", minLength: 1 })),
        answer: t.Optional(t.String({ error: "invalid answer" })),
        user_id: t.String({ error: "invalid user", pattern: "^[0-0A-Fa-f]{24}$" }),
        question_id: t.Optional(t.Transform(
            t.String({ error: "invalid user", pattern: "^[0-0A-Fa-f]{24}$" }))
            .Decode((id) => new ObjectId(id)).Encode((id) => id.toHexString()
        ))
    })
}

export type TChatBot = {
    [t in keyof typeof chatBotSchema]: UnwrapSchema<typeof chatBotSchema[t]>;
}