import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "../mongodb/service";

export const authServiceApi = betterAuth({
    baseURL: import.meta.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db()),
    secret: import.meta.env.BETTER_AUTH_SECRET,
    trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],

    advanced: {
        database: { generateId: false },
        cookies: {
            session_token: {
                attributes: {
                    secure: process.env.NODE_ENV === "production",
                    httpOnly: true, 
                    sameSite: "lax",
                }
            }
        }
    },

    databaseHooks: {
        session: {
            delete: {
                after: async (session) => {
                    if (session?.id) {
                        const database = db();
                        await database.collection("session").deleteOne({ id: session.id });
                    }
                }
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        maxPasswordLength: 130,
        minPasswordLength: 8
    },

    session: {
        cookieCache: { enabled: true, maxAge: 300000 },
        expiresIn: 604800000,
        updateAge: 86400000,
    },

    user: {
        additionalFields: {
            address: { type: "string", required: false },
            description: { type: "string", required: false },
            gender: { type: "string", required: false },
            group_ids: { type: "string[]", required: false },
            image_public_id: { type: "string", required: false },
            image_filename: { type: "string", required: false },
            image_filetype: { type: "string", required: false },
            image_resource_type: { type: "string", required: false }
        }
    }
});

export async function validateSession(token: string) {
    if (!token) return null;

    const headers = new Headers();
    headers.set("cookie", `better-auth.session_token=${token}`);

    const session = await authServiceApi.api.getSession({ headers });
    return session;
}