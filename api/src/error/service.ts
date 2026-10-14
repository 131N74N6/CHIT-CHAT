import Elysia from "elysia";

export class ChitChatApiError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ChitChatApiError"
    }
}

export function setupErrorHandler(app: Elysia) {
    return app.error({ ChitChatApiError })
    .onError(({ code, error, set }) => {
        if (code === "ChitChatApiError" || error instanceof ChitChatApiError) {
            const apiError = error as ChitChatApiError;
            set.status = apiError.statusCode || 500;
            return { message: apiError.message }
        }

        if (code === "VALIDATION") {
            set.status = 400;

            const firstError = error.all[0];
            if (!firstError) return { message: "invalid required data"}

            const fieldName = firstError.path?.replace(/^\//, '') || 'unknown';
            const customSchemaError = firstError.schema.error;

            if (customSchemaError) return { message: customSchemaError }

            const defaultMessage = firstError.message || "something went wrong";
            let finalMessage = defaultMessage;

            if (defaultMessage.includes("Expected kind 'File'") || defaultMessage.includes("Expected File")) {
                finalMessage = `${fieldName} file is required or invalid.`;
            } else if (defaultMessage.includes("Expected string") || defaultMessage.includes("Required property")) {
                finalMessage = `${fieldName} is required.`;
            } else if (defaultMessage.includes("Expected number")) {
                finalMessage = `${fieldName} must be a number.`;
            } else if (defaultMessage.includes("minLength") || defaultMessage.includes("maxLength")) {
                finalMessage = `${fieldName} length is invalid.`;
            } else if (defaultMessage.includes("pattern")) {
                finalMessage = `${fieldName} format is invalid.`;
            } else if (!finalMessage) {
                finalMessage = `${fieldName} is invalid.`;
            }

            return { message: finalMessage };
        }

        if (code === 'NOT_FOUND') {
            set.status = 404;
            return { message: error.message || "resource not found" };
        }

        set.status = 500;
        return { message: "something went wrong" };
    });
}