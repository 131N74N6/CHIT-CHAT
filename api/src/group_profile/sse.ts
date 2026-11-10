import { EventEmitter } from "events";

const encoder = new TextEncoder();

export const userProfileEvent = new EventEmitter();

export const groupProfileSSEHeaders = {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
}

export const groupProfileSSEFormat = (event: string, data: unknown, id?: string) => {
    const lines: string[] = [];

    if (id) lines.push(`id: ${id}`);

    lines.push(`event: ${event}`);
    lines.push(`data: ${JSON.stringify(data)}`);

    return `${lines.join("\n")}\n\n`;
}

export const createGroupProfileErrorStream = () => {
    return new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(encoder.encode(groupProfileSSEFormat("auth-error", { message: "unauthorized" })));
            controller.close();
        }
    });
}

export const createGroupProfileSSEStream = (groupId: string, userId: string) => {
    const listeners: { room: string; handler: (payload: any) => void; }[] = [];
    let controller: ReadableStreamDefaultController<Uint8Array> | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;

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
            controller.enqueue(encoder.encode(groupProfileSSEFormat(event, data, `${Date.now()}`)));
        } catch {
            cleanup();
        }
    }
    
    const subscribe = (room: string, handler: (payload: any) => void) => {
        userProfileEvent.on(room, handler);
        listeners.push({ room, handler });
    }

    const groupProfileHandler = (payload: any) => {
        const data = payload?.data ?? payload;
        const type = payload?.type;

        if (type === "group-profile-picture:deleted") {
            send("group-profile-picture:deleted", data);
            return;
        }

        if (type === "group-profile:deleted") {
            send("group-profile:deleted", data);
            return;
        }

        send("group-profile:changed", data);
    }

    const joinedGroupHandler = (payload: any) => {
        const data = payload?.data ?? payload;
        const type = payload?.type;

        if (type === "joined-group-profile-picture:deleted") {
            send("joined-group-profile-picture:deleted", data);
            return;
        }

        if (type === "joined-group:deleted") {
            send("joined-group:deleted", data);
            return;
        }

        send("joined-group:changed", data);
    }

    const stream = new ReadableStream<Uint8Array>({
        start(c) {
            controller = c;

            c.enqueue(encoder.encode("retry: 3000\n\n"));

            send("connected", {
                message: "sse connected",
                user_id: userId,
            });

            subscribe(`group-profile-${groupId}`, groupProfileHandler);
            subscribe(`joined-group-${userId}`, joinedGroupHandler);

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