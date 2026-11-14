import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { useMessageStore } from "../alert/store";
import { useUserStore } from "./store";
import { apiRequest } from "../api";

export default function useUserProfileWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);
    const currentUserId = useUserStore((state) => state.currentUserId);

    const getSessionToken = useQuery({
        enabled: !!currentUserId,
        queryFn: async () => {
            const response = await apiRequest<string>("/api/v1/users/session", { method: "GET" });
            return response.data;
        },
        queryKey: [`user-session-token-${currentUserId}`],
        retry: 3,
        retryDelay: 1000,
    });

    function buildWsUrl(backendUrl: string, token: string) {
        const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
        const backendHost = backendUrl.replace(/^https?:\/\//, "");
        const encodedToken = encodeURIComponent(token);
        const wsUrl = `${wsProtocol}//${backendHost}/api/v1/users/ws?token=${encodedToken}`;
        return wsUrl;
    }

    const connect = useCallback(() => {
        if (!currentUserId) return;
        if (getSessionToken.isLoading || !getSessionToken.data) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("Authentication failed");
            return;
        }

        const wsUrl = buildWsUrl(`${import.meta.env.VITE_BASE_API_URL}`, token);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            const heartbeat = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
            }, 30000);
            
            (ws as any).heartbeatInterval = heartbeat;
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "pong") return;

            if (data.type === "error") {
                setMessage(data.message);
                return;
            }

            if (
                data.type === "user-profile:changed" || 
                data.type === "user-profile:deleted" || 
                data.type === "user-profile:profile-picture-deleted"
            ) {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey[0];
                        if (typeof key !== "string") return false;

                        return (
                            key.startsWith("current-user") ||
                            key.startsWith("all-users") ||
                            key.startsWith("group-member-") ||
                            key.startsWith("other-user-") ||
                            key.startsWith("group-chat-")
                        );
                    }
                });
            }
        }
        
        ws.onclose = () => {
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }

        ws.onerror = () => {
            ws.close();
        }
    }, [currentUserId, queryClient]);
    
    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                clearInterval((wsRef.current as any).heartbeatInterval);

                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.close(1000, "Unmounted");
                }
            }

            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        }
    }, [connect]);

    return wsRef.current;
}