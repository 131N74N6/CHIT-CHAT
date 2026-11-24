export type GroupProfileWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

class GroupProfileWebSocket {
    addTunnel(group_id: string, ws: GroupProfileWSData) {
        if (!this.groupProfileTunnel.has(group_id)) this.groupProfileTunnel.set(group_id, new Set());
        this.groupProfileTunnel.get(group_id)?.add(ws);
    }

    broadcast(event_name: string) {
        const payload = JSON.stringify({ type: event_name });

        for (const groupProfile of this.groupProfileTunnel.values()) {
            for (const ws of groupProfile) {
                if (ws.readyState === 1) ws.send(payload);
            }
        }
    }

    private groupProfileTunnel = new Map<string, Set<GroupProfileWSData>>();

    removeTunnel(group_id: string, ws: GroupProfileWSData) {
        const tunnel = this.groupProfileTunnel.get(group_id);
        
        if (tunnel) {
            tunnel.delete(ws);
            if (tunnel.size === 0) this.groupProfileTunnel.delete(group_id);
        }
    }
}

const groupProfileWebSocket = new GroupProfileWebSocket();

export default groupProfileWebSocket;