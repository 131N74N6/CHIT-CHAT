import EventEmitter from "eventemitter3";

class GroupProfileWebSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string | null = null;

    private reconnectAttemps = 0;
    private maxReconnectAttemps = 5;
    private reconnectDelay = 1000;

    private groupId = "";
    private backendUrl = "";
    private token = "";

    protected isConnecting = false;
    private messageQueue: any[] = [];
    private shouldReconnect = true;

    private bindEvents() {
        if (!this.ws) return;

        this.ws.onopen = () => {
            this.isConnecting = false;
            this.reconnectAttemps = 0;
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
                this.emit("error", { message: "failed to get data", type: "error" });
            }
        }

        this.ws.onerror = () => {
            this.emit("error", { message: "connection failed", type: "error" });
        }

        this.ws.onclose = () => {
            this.isConnecting = false;
            this.emit("disconnected");

            if (this.shouldReconnect && (this.reconnectAttemps < this.maxReconnectAttemps)) {
                this.reconnectAttemps++;
                const delay = this.reconnectDelay * Math.pow(2, (this.reconnectDelay - 1));

                this.emit("reconnecting", { message: "Reconnecting..." });
                setTimeout(() => {
                    if (this.url) this.connectUrl();
                }, delay);
            } else if (this.shouldReconnect) {
                this.emit("max_retried", { message: "Connection lost. Please refresh the page." });
            }
        }
    }

    private buildWsUrl(backendUrl: string, groupId: string, token: string) {
        const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, "");
        const encodedToken = encodeURIComponent(token);
        const wsUrl = `${wsProtocol}//${backendHost}/api/v1/groups/ws?group_id=${groupId}&token=${encodedToken}`;
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
    
    private connectUrl() {
        if (this.backendUrl && this.token && this.groupId && this.url) {
            this.isConnecting = false;
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

export const groupProfileWebSocket = new GroupProfileWebSocket();