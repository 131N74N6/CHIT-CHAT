import { UnwrapSchema } from "elysia"

export const chatBotSchema = {}

export type TChatBot = {
    [t in keyof typeof chatBotSchema]: UnwrapSchema<typeof chatBotSchema[t]>;
}