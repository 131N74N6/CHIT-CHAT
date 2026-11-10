import { EventEmitter } from "events";

const encoder = new TextEncoder();

export const userProfileEvent = new EventEmitter();

export const SSE_HEADERS = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
}

export const formatSSE = (event: string, data: unknown, id?: string) => {
    const lines: string[] = [];

    if (id) lines.push(`id: ${id}`);

    lines.push(`event: ${event}`);
    lines.push(`data: ${JSON.stringify(data)}`);

    return `${lines.join("\n")}\n\n`;
}

export const createAuthErrorStream = () => {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(encoder.encode(formatSSE("auth-error", { message: "unauthorized" })));
            controller.close();
        },
    });
}

export const createUserSSEStream = (userId: string) => {
    let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;

    const listeners: {
        room: string;
        handler: (payload: any) => void;
    }[] = [];

    const cleanup = () => {
        if (heartbeat) {
            clearInterval(heartbeat);
            heartbeat = null;
        }

        for (const listener of listeners) {
            userProfileEvent.off(listener.room, listener.handler);
        }

        listeners.length = 0;
        controller = null;
    }

    const send = (event: string, data: unknown) => {
        if (!controller) return;

        try {
            controller.enqueue(encoder.encode(formatSSE(event, data, `${Date.now()}`)));
        } catch {
            cleanup();
        }
    }

    const subscribe = (room: string, handler: (payload: any) => void) => {
        userProfileEvent.on(room, handler);
        listeners.push({ room, handler });
    }

    const availableHandler = (payload: any) => {
        const data = payload?.data ?? payload;
        const type = payload?.type;

        if (type === "available-user:deleted") {
            send("available-user:deleted", data);
            return;
        }

        if (type === "available-user-profile-picture:deleted") {
            send("available-user-profile-picture:deleted", data);
            return;
        }

        send("available-user:changed", data);
    }

    const currentHandler = (payload: any) => {
        const data = payload?.data ?? payload;
        const type = payload?.type;

        if (type === "user-profile:deleted") {
            send("current-user-profile:deleted", data);
            return;
        }

        if (type === "user-profile-picture:deleted") {
            send("current-user-profile-picture:deleted", data);
            return;
        }

        send("current-user-profile:changed", data);
    }

    const stream = new ReadableStream<Uint8Array>({
        start(c) {
            controller = c;

            c.enqueue(encoder.encode("retry: 3000\n\n"));

            send("connected", {
                message: "sse connected",
                user_id: userId,
            });

            subscribe("available-user", availableHandler);
            subscribe(`user-profile-${userId}`, currentHandler);

            heartbeat = setInterval(() => {
                if (!controller) return;

                try {
                    controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
                } catch {
                    cleanup();
                }
            }, 15000);
        },

        cancel() {
            cleanup();
        },
    });

    return stream;
}