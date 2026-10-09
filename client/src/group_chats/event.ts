import { EventEmitter } from "eventemitter3";

class GroupChatWebSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string | null = null;

    private reconnectAttemps = 0;
    private maxReconnectAttemps = 5;
    private reconnectDelay = 2000;

    private messageQueue: any[] = [];
    private isConnecting = false;
    private shouldReconnect = true;

    private token = "";
    private backendUrl = "";
    private groupId = "";

    private bindEvents() {}

    private buildWsUrl(backendUrl: string, groupId: string, token: string) {
        const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, "");
        const encodedToken = encodeURIComponent(token);
        const wsUrl =  `${wsProtocol}//${backendHost}/api/v1/groups/chats/ws?group_id=${groupId}&token=${encodedToken}`;
        return wsUrl;
    }

    private connectWithUrl() {
        if (this.token && this.url && this.groupId && this.backendUrl) {
            this.isConnecting = true;
            this.ws = new WebSocket(this.url);
            this.bindEvents();
        }
    }

    disconnect() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.url = null;
    }

    enableReconnect() {
        this.shouldReconnect = true;
    }
}

export const groupChatWebSocket = new GroupChatWebSocket();