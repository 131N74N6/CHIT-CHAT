export type GroupMemberWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

export const groupMemberContext = new Map<string, Set<GroupMemberWSData>>();

export function addTunnel(group_id: string, ws: GroupMemberWSData) {
    if (!groupMemberContext.has(group_id)) groupMemberContext.set(group_id, new Set());
    groupMemberContext.get(group_id)?.add(ws);
}

export function groupMemberBroadcast(event_name: string) {
    const payload = JSON.stringify({ type: event_name });

    for (const groupMember of groupMemberContext.values()) {
        for (const ws of groupMember) {
            if (ws.readyState === 1) ws.send(payload);
        }
    }
}

export function removeTunnel(group_id: string, ws: GroupMemberWSData) {
    const tunnel = groupMemberContext.get(group_id);

    if (tunnel) {
        tunnel.delete(ws);
        if (tunnel.size === 0) groupMemberContext.delete(group_id);
    }
}