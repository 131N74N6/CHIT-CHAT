import EventEmitter from "eventemitter3";

class UserProfileWebSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string | null = "";

    private reconnectAttemps = 0;
    private maxReconnectAttemps = 5;
    private reconnectDelay = 1000;

    private messageQueue: any[] = [];
    private isConnecting = false;
    private shouldReconnect = true;

    private token = "";
    private backendUrl = "";
    private userId = "";

    connect(token: string, backendUrl: string) {
        if (!this.isConnecting) return;

        if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
            return;
        }

        const newWsUrl = this.buildWsUrl(token, backendUrl);
        
        if (this.url && this.url !== newWsUrl) {
            this.disconnected();
        }

        this.url = newWsUrl;
        this.isConnecting = true;
        this.ws = new WebSocket(this.url);
        
        this.bindEvents();
    }

    private bindEvents() {
        if (!this.ws) return;

        this.ws.onopen = () => {
            this.reconnectAttemps = 0;
            this.isConnecting = false;
            this.emit("connected", { message: "you're connected", type: "connected" });

            this.messageQueue.forEach((message) => this.ws?.send(message));
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
            } catch (error) {
                this.emit("error", { type: "error", message: "Failed to get data" });
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

                this.emit("reconnecting", { message: "Reconnecting..." });
                setTimeout(() => {
                    if (this.url) this.connectFromUrl();
                }, delay);
            } else if (this.shouldReconnect) {
                this.emit("max_retries", { message: "Connection lost. Please refresh the page." });
            }
        }
    }

    private buildWsUrl(token: string, backendUrl: string) {
        const wsProtocol = backendUrl.includes("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, "");
        const encodedToken = encodeURIComponent(token);
        const wsUrl = `${wsProtocol}//${backendHost}/api/v1/users/ws?token${encodedToken}`;
        return wsUrl;
    }

    private connectFromUrl() {
        if (this.backendUrl && this.url && this.token && this.userId) {
            this.isConnecting = true;
            this.ws = new WebSocket(this.url);
            this.bindEvents();
        }
    }

    disconnected() {
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

export const userProfileWebSocket = new UserProfileWebSocket();