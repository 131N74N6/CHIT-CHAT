export type GroupMemberWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

class GroupMemberWebSocket {
    addTunnel(group_id: string, ws: GroupMemberWSData) {
        if (!this.groupMemberTunnel.has(group_id)) this.groupMemberTunnel.set(group_id, new Set());
        this.groupMemberTunnel.get(group_id)?.add(ws);
    }

    broadcast(event_name: string) {
        const dataToSend = JSON.stringify({ type: event_name });

        for (const groupMember of this.groupMemberTunnel.values()) {
            for (const ws of groupMember) {
                if (ws.readyState === 1) ws.send(dataToSend);
            }
        }
    }

    private groupMemberTunnel = new Map<string, Set<GroupMemberWSData>>();

    removeTunnel(group_id: string, ws: GroupMemberWSData) {
        const tunnel = this.groupMemberTunnel.get(group_id);

        if (tunnel) {
            tunnel.delete(ws);
            if (tunnel.size === 0) this.groupMemberTunnel.delete(group_id);
        }
    }
}

const groupMemberWebSocket = new GroupMemberWebSocket();

export default groupMemberWebSocket;