import { OpenRouter } from "@openrouter/sdk";
import { ChatResult } from "@openrouter/sdk/models";

export interface CreateDocsI {
    codes: string;
    language: string;
}

const ai = new OpenRouter({ apiKey: process.env.OPEN_ROUTER_API_KEY });
const model = process.env.OPEN_ROUTER_AI_MODEL;

export async function createDocumentation(props: CreateDocsI) {
    try {
        const response: ChatResult = await ai.chat.send({
            chatRequest: {
                model: model,
                messages: [{
                    "role": "user",
                    "content": `
                        ${props.codes}\n
                        Tolong buatkan dokumentasi pada kode program ini dengan rapi dan terstruktur 
                        menggunakan bahasa ${props.language} sehingga orang lain dapat memahami cara kerjanya. 
                        Tolak dengan sopan jika yang dimasukkan bukan kode program.
                    `
                }]
            }
        });

        if (response.choices && response.choices.length > 0) {
            return { result: response.choices[0].message.content };
        }
        
        throw new Error("AI returned an empty response.");
    } catch (error: any) {
        if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
            throw new Error('AI API authentication failed: Invalid API key. Check AI_API_KEY environment variable.');
        }

        if (error.name === 'AbortError' || error.name === 'TimeoutError') {
            throw new Error('AI API request timeout. Please try again');
        }

        if (error.message?.includes('MODEL_NOT_FOUND') || error.message?.includes('not found')) {
            throw new Error(`AI model '${model}' not found. Check AI_MODEL environment variable.`);
        }

        if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
            throw new Error('AI API quota exceeded. Please wait a moment and try again.');
        }

        if (error.message?.includes('SAFETY') || error.message?.includes('blocked')) {
            throw new Error('AI analysis blocked due to safety concerns. Try a different image.');
        }

        if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
            throw new Error('AI analysis timed out. Please try with a smaller image.');
        }

        if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
            throw new Error('Check your internet connection.');
        }

        if (error.message?.includes('PERMISSION_DENIED')) {
            throw new Error('Access denied. Your API key may not have permission to use this model.');
        }

        throw new Error(`AI analysis failed: ${error.message || 'Unknown error'}`);
    }
}