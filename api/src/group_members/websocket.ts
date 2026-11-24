export type GroupMemberWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

export const groupMemberTunnel = new Map<string, Set<GroupMemberWSData>>();

export function addTunnel(group_id: string, ws: GroupMemberWSData) {
    if (!groupMemberTunnel.has(group_id)) groupMemberTunnel.set(group_id, new Set());
    groupMemberTunnel.get(group_id)?.add(ws);
}

export function groupMemberBroadcast(event_name: string) {
    const dataToSend = JSON.stringify({ type: event_name });

    for (const groupMember of groupMemberTunnel.values()) {
        for (const ws of groupMember) {
            if (ws.readyState === 1) ws.send(dataToSend);
        }
    }
}

export function removeTunnel(group_id: string, ws: GroupMemberWSData) {
    const tunnel = groupMemberTunnel.get(group_id);

    if (tunnel) {
        tunnel.delete(ws);
        if (tunnel.size === 0) groupMemberTunnel.delete(group_id);
    }
}