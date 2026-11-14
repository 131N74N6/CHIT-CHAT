export type GroupProfileWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

export const groupProfileContext = new Map<string, Set<GroupProfileWSData>>();

export function broadcast(event_name: string) {
    const payload = JSON.stringify({ type: event_name });

    for (const groupProfile of groupProfileContext.values()) {
        for (const ws of groupProfile) {
            if (ws.readyState === 1) ws.send(payload);
        }
    }
}

export function addTunnel(group_id: string, ws: GroupProfileWSData) {
    if (!groupProfileContext.has(group_id)) groupProfileContext.set(group_id, new Set());
    groupProfileContext.get(group_id)?.add(ws);
}

export function removeTunnel(group_id: string, ws: GroupProfileWSData) {
    const tunnel = groupProfileContext.get(group_id);
    
    if (tunnel) {
        tunnel.delete(ws);
        if (tunnel.size === 0) groupProfileContext.delete(group_id);
    }
}
