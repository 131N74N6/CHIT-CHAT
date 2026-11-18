import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useMessageStore } from "../alert/useMessageStore";
import { useGroupChatStore } from "../group_chats/useGroupChatStore";
import { apiRequest } from "../api";
import { useUserStore } from "../user_profiles/useUserStore";

function buildWsUrl(backend_url: string, group_id: string, token: string) {
    const wsProtocol = backend_url.startsWith("https") ? "wss:" : "ws:";
    const host = backend_url.replace(/^https?:\/\//, "");
    const encodedToken = encodeURIComponent(token);
    const wsUrl = `${wsProtocol}//${host}/api/v1/groups/ws/${group_id}?token=${encodedToken}`;
    return wsUrl;
}

export default function useGroupProfileWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isConncectingRef = useRef<boolean>(false);

    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);
    const groupId = useGroupChatStore((state) => state.groupId);
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
    
    useEffect(() => {
        let isMounted = true;

        function connect() {
            if (!getSessionToken.data || getSessionToken.isLoading || !isMounted || !groupId) return;
    
            const token = getSessionToken.data;
    
            if (!token || typeof token !== "string") {
                setMessage("Authentication failed");
                return;
            }
    
            isConncectingRef.current = true;
            const wsUrl = buildWsUrl(`${import.meta.env.VITE_BASE_API_URL}`, groupId, token);

            if (wsRef.current?.readyState === WebSocket.OPEN && wsRef.current.url === wsUrl) {
                isConncectingRef.current = false;
                return;
            }

            if (wsRef.current) {
                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.close(1000, "Reconnecting...");
                } else {
                    wsRef.current = null;
                }
            }

            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!isMounted) return;

                isConncectingRef.current = false;

                const heartbeat = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type : "ping" }));
                }, 30000);

                (ws as any).heartbeatInterval = heartbeat;
            }
    
            ws.onmessage = (event) => {
                if (!isMounted) return;

                const data = JSON.parse(event.data);
    
                if (data.type === "pong") return;
    
                if (data.type === "error") {
                    setMessage(data.message);
                    return;
                }
    
                if (
                    data.type === "group-profile:changed" || 
                    data.type === "group-profile:deleted" || 
                    data.type === "group-profile:profile-picture-deleted"
                ) {
                    queryClient.invalidateQueries({
                        predicate: (query) => {
                            const key = query.queryKey[0];
                            if (typeof key !== "string") return false;
    
                            return (
                                key.startsWith("group-profile-") ||
                                key.startsWith("group-owner-") ||
                                key.startsWith("available-group-")
                            );
                        }
                    });
                }
            }
    
            ws.onclose = (event) => {
                if (!isMounted) return;
                if (!groupId) return;

                isConncectingRef.current = false;

                if ((ws as any).heartbeatInterval) clearInterval((ws as any).heartbeatInterval);
                if (event.code === 4001 || event.code === 4002) return;

                reconnectTimeoutRef.current = setTimeout(() => {
                    if (isMounted) connect();
                }, 3000);
            }
    
            ws.onerror = () => {
                if (!isMounted) return;
            }
        }

        connect();

        return () => {
            isMounted = false;
            isConncectingRef.current = false;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (wsRef.current) {
                if ((wsRef.current as any).heartbeatInterval) {
                    clearInterval((wsRef.current as any).heartbeatInterval);
                }

                if (wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.close(1000, "Unmounted");
                }

                wsRef.current = null;
            }
        }
    }, [getSessionToken.data, getSessionToken.isLoading, groupId, queryClient, setMessage]);

    return wsRef.current;
}