export type UserProfileWSData = {
    send(data: string | ArrayBuffer | SharedArrayBuffer): void;
    readyState: number;
}

class UserProfileWebSocket {
    addTunnel(user_id: string, ws: UserProfileWSData) {
        if (!this.userProfileTunnel.has(user_id)) this.userProfileTunnel.set(user_id, new Set());
        this.userProfileTunnel.get(user_id)?.add(ws);
    }

    broadcast(event_name: string) {
        const payload = JSON.stringify({ type: event_name });

        for (const userProfile of this.userProfileTunnel.values()) {
            for (const ws of userProfile) {
                if (ws.readyState === 1) ws.send(payload);
            }
        }
    }

    removeTunnel(user_id: string, ws: UserProfileWSData) {
        const tunnel = this.userProfileTunnel.get(user_id);
        
        if (tunnel) {
            tunnel.delete(ws);
            if (tunnel.size === 0) this.userProfileTunnel.delete(user_id);
        }
    }

    private userProfileTunnel = new Map<string, Set<UserProfileWSData>>();
}

const userProfileWebSocket = new UserProfileWebSocket();

export default userProfileWebSocket;