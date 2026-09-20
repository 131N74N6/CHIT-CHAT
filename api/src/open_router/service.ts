import { OpenRouter } from "@openrouter/sdk";
import { ChitChatApiError } from "../error/handler";

const model = process.env.OPEN_ROUTER_AI_MODEL;
const openRouterAi = new OpenRouter({ apiKey: process.env.OPEN_ROUTER_API_KEY });

export async function getAndShowResponse(commands: string) {
    try {
        const response: any = await openRouterAi.chat.send({
            chatRequest: {
                model: model,
                messages: [{
                    "role": "user",
                    "content": commands
                }]
            }
        });

        if (response.choices && response.choices.length > 0) {
            return { result: response.choices[0].message.content };
        }
        
        throw new ChitChatApiError("AI returned an empty response. Please try a different title.", 500);
    } catch (error: any) {
        if (error.message?.includes("API_KEY_INVALID") || error.message?.includes("API key not valid")) {
            throw new ChitChatApiError("AI service is currently unavailable. Please try again later.", 500);
        }

        if (error.name === "AbortError" || error.name === "TimeoutError") {
            throw new ChitChatApiError("AI request timed out. Please try again.", 504);
        }

        if (error.message?.includes("MODEL_NOT_FOUND") || error.message?.includes("not found")) {
            throw new ChitChatApiError("AI service configuration error", 500);
        }

        if (error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
            throw new ChitChatApiError("AI usage limit reached. Please wait a moment and try again.", 429);
        }

        if (error.message?.includes("SAFETY") || error.message?.includes("blocked")) {
            throw new ChitChatApiError("Content generation blocked due to safety guidelines. Please adjust your title or try a different topic.", 400);
        }

        if (error.message?.includes("timeout") || error.message?.includes("ETIMEDOUT")) {
            throw new ChitChatApiError("AI analysis timed out", 504);
        }

        if (error.message?.includes("ECONNREFUSED") || error.message?.includes("ENOTFOUND")) {
            throw new ChitChatApiError("AI service is temporarily unreachable.", 503);
        }

        if (error.message?.includes("PERMISSION_DENIED")) {
            throw new ChitChatApiError("Access denied.", 403);
        }

        throw new ChitChatApiError("Failed to generate blog content. Please try again.", 500);
    }
}