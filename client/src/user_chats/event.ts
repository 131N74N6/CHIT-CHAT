import { EventEmitter } from "eventemitter3";

class UserChatWebSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string | null = null;

    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;

    private messageQueue: any[] = [];
    private isConnecting = false;
    private shouldReconnect = true;

    private token: string = "";
    private backendUrl: string = "";
    private otherUserId: string = "";

    connect (token: string, otherUserId: string, backendUrl: string) {
        if (this.isConnecting) {
            return;
        }

        if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        const newWsUrl = this.buildWsUrl(token, otherUserId, backendUrl);
        
        if (this.url && this.url !== newWsUrl) {
            this.disconnect();
        }

        this.url = newWsUrl;
        this.isConnecting = true;
        this.ws = new WebSocket(this.url);
        
        this.bindEvents();
    }

    private bindEvents() {
        if (!this.ws) return;
        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.isConnecting = false;
            this.emit("connected", { type: "connected", message: "You're connected" });

            this.messageQueue.forEach(msg => this.ws?.send(msg));
            this.messageQueue = [];
        }

        this.ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                
                if (payload.type === "error") {
                    this.emit("error", { type: "error", message: payload.message });
                    return;
                }

                this.emit("message", payload);
            } catch (err) {
                this.emit("error", { type: "error", message: "Failed to parse message" });
            }
        }

        this.ws.onerror = () => {
            this.emit("error", { type: "error", message: "Connection failed" });
        }

        this.ws.onclose = () => {
            this.isConnecting = false;
            this.emit('disconnected');

            if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

                this.emit("reconnecting", { message: "Reconnecting...", attempt: this.reconnectAttempts });
                setTimeout(() => {
                    if (this.url) this.connectFromUrl();
                }, delay);
            } else if (this.shouldReconnect) {
                this.emit("max_retries", { message: "Connection lost. Please refresh the page." });
            }
        };
    }

    private buildWsUrl(token: string, otherUserId: string, backendUrl: string) {
        const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, '');
        const encodedToken = encodeURIComponent(token);
        const wsUrl = `${wsProtocol}//${backendHost}/api/chats/ws/${otherUserId}?token=${encodedToken}`;
        return wsUrl;
    }

    private connectFromUrl() {
        if (this.url && this.token && this.otherUserId && this.backendUrl) {
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

export const userChatWebSocket = new UserChatWebSocket();