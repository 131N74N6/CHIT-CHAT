export type UserProfileWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

export const userProfileContext = new Map<string, Set<UserProfileWSData>>();

export function addTunnel(user_id: string, ws: UserProfileWSData) {
    if (!userProfileContext.has(user_id)) userProfileContext.set(user_id, new Set());
    userProfileContext.get(user_id)?.add(ws);
}

export function removeTunnel(user_id: string, ws: UserProfileWSData) {
    const tunnel = userProfileContext.get(user_id);
    
    if (tunnel) {
        tunnel.delete(ws);
        if (tunnel.size === 0) userProfileContext.delete(user_id);
    }
}

export function userProfileBroadcast(event_name: string) {
    const payload = JSON.stringify({ type: event_name });

    for (const userProfile of userProfileContext.values()) {
        for (const ws of userProfile) {
            if (ws.readyState === 1) ws.send(payload);
        }
    }
}