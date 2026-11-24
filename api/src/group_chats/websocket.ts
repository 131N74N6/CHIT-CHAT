export type GroupChatWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

class GroupChatWebSocket {
    addTunnel(group_id: string, ws: GroupChatWSData) {
        if (!this.groupChatTunnel.has(group_id)) this.groupChatTunnel.set(group_id, new Set());
        this.groupChatTunnel.get(group_id)?.add(ws);
    }

    groupChatBroadcast(event_name: string) {
        const dataToSend = JSON.stringify({ type: event_name });

        for (const groupChat of this.groupChatTunnel.values()) {
            for (const ws of groupChat) {
                if (ws.readyState === 1) ws.send(dataToSend);
            }
        }
    }

    private groupChatTunnel = new Map<string, Set<GroupChatWSData>>();

    removeTunnel(group_id: string, ws: GroupChatWSData) {
        const tunnel = this.groupChatTunnel.get(group_id);

        if (tunnel) {
            tunnel.delete(ws);
            if (this.groupChatTunnel.size === 0) this.groupChatTunnel.delete(group_id);
        }
    }
}

const groupChatWebSocket = new GroupChatWebSocket();

export default groupChatWebSocket;