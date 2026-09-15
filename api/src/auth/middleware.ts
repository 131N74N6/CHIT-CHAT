import Elysia from "elysia";
import { authServiceApi } from "./service";
import { ChitChatApiError } from "../error/handler";

export const apiAuthMiddleware = (app: Elysia) => {
    return app.derive(async ({ request }) => {
        const session = await authServiceApi.api.getSession({ headers: request.headers });
        if (!session) throw new ChitChatApiError("Please login first", 401);
        return { user: session.user }
    });
}