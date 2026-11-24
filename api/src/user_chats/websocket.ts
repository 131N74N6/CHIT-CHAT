export type UserChatWsData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

class UserChatWebSocket {
    addTunnel(userChatId: string, ws: UserChatWsData) {
        if (!this.userChatTunnel.has(userChatId)) this.userChatTunnel.set(userChatId, new Set());
        this.userChatTunnel.get(userChatId)?.add(ws);
    }

    broadcast(event_name: string) {
        const dataToSend = JSON.stringify({ type: event_name });

        for (const userChat of this.userChatTunnel.values()) {
            for (const ws of userChat) {
                if (ws.readyState === 1) ws.send(dataToSend);
            }
        }
    }

    removeTunnel(userChatId: string, ws: UserChatWsData) {
        const tunnel = this.userChatTunnel.get(userChatId);

        if (tunnel) {
            tunnel.delete(ws);
            if (this.userChatTunnel.size === 0) this.userChatTunnel.delete(userChatId);
        }
    }

    private userChatTunnel = new Map<string, Set<UserChatWsData>>();
}

const userChatWebSocket = new UserChatWebSocket();

export default userChatWebSocket;