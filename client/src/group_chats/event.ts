import { EventEmitter } from "eventemitter3";

class GroupChatWebSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string | null = null;

    private reconnectAttemps = 0;
    private maxReconnectAttemps = 5;
    private reconnectDelay = 2000;

    private messageQueue: any[] = [];
    protected isConnecting = false;
    private shouldReconnect = true;

    private token = "";
    private backendUrl = "";
    private groupId = "";

    private bindEvents() {
        if (!this.ws) return;

        this.ws.onopen = () => {
            this.reconnectAttemps = 0;
            this.isConnecting = false;
            this.emit("connect", { type: "connect", message: "You're connected" });

            this.messageQueue.forEach((message) => this.ws?.send(message));
            this.messageQueue = [];
        }

        this.ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);

                if (payload.type === "error") {
                    this.emit("error", { message: payload.message, type: "error" });
                    return;
                }

                this.emit("message", payload);
            } catch (error) {
                this.emit("error", { type: "error", message: "Failed to get message" });
            }
        }

        this.ws.onerror = () => {
            this.emit("error", { type: "error", message: "Connection failed" });
        }

        this.ws.onclose = () => {
            this.isConnecting = false;
            this.emit("disconnected");

            if (this.shouldReconnect && (this.reconnectAttemps < this.maxReconnectAttemps)) {
                this.reconnectAttemps++;
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttemps - 1);
                this.emit("reconnecting", { message: "Reconnecting...", attempt: this.reconnectAttemps });
                setTimeout(() => {
                    if (this.url) this.connectWithUrl();
                }, delay);
            } else if (this.shouldReconnect) {
                this.emit("max_retries", { message: "Connection lost. Please refresh the page." });
            }
        }
    }

    private buildWsUrl(backendUrl: string, groupId: string, token: string) {
        const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, "");
        const encodedToken = encodeURIComponent(token);
        const wsUrl =  `${wsProtocol}//${backendHost}/api/v1/groups/chats/ws?group_id=${groupId}&token=${encodedToken}`;
        return wsUrl;
    }

    connect(backendUrl: string, groupId: string, token: string) {
        const newWsUrl = this.buildWsUrl(backendUrl, groupId, token);
        
        if (this.url === newWsUrl && this.ws?.readyState === WebSocket.OPEN) return;

        if (this.url !== newWsUrl) {
            this.shouldReconnect = false; 
            
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
        }

        this.url = newWsUrl;
        this.token = token;
        this.groupId = groupId;
        this.backendUrl = backendUrl;
        this.isConnecting = true;
        this.shouldReconnect = true;
        this.reconnectAttemps = 0;
        this.messageQueue = [];
        this.ws = new WebSocket(this.url);
        this.bindEvents();
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

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    send(message: any) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            this.messageQueue.push(message);
        }
    }
}

export const groupChatWebSocket = new GroupChatWebSocket();