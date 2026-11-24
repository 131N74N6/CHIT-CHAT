import { useEffect, useRef } from "react";
import { useUserChatStore } from "./useUserChatStore";
import { useUserStore } from "../user_profiles/useUserStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../alert/useMessageStore";
import { apiRequest } from "../api";

function buildWsUrl(backendUrl: string, receiverId: string, token: string) {
    const wsProtocol = backendUrl.startsWith("https") ? "wss:" : "ws:";
    const backendHost = backendUrl.replace(/^https?:\/\//, "");
    const encodedToken = encodeURIComponent(token);
    const wsUrl = `${wsProtocol}//${backendHost}/api/v1/user-chats/ws/${receiverId}?token=${encodedToken}`;
    return wsUrl;
}

export default function useUserChatWebSocket() {
    const queryClient = useQueryClient();
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isConncectingRef = useRef<boolean>(false);
    
    const currentUserId = useUserStore((state) => state.currentUserId);
    const receiverId = useUserChatStore((state) => state.receiverId);
    const setMessage = useMessageStore((state) => state.setMessage);

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
            if (
                !currentUserId || currentUserId === "" || 
                getSessionToken.isLoading || 
                !getSessionToken.data || !isMounted || 
                !receiverId || receiverId === ""
            ) {
                return;
            }

            const token = getSessionToken.data;

            if (!token || typeof token !== "string") {
                setMessage("Authentication failed");
                return;
            }

            isConncectingRef.current = true;
            const newWsUrl = buildWsUrl(`${import.meta.env.VITE_BASE_API_URL}`, receiverId, token);

            if (wsRef.current?.readyState === WebSocket.OPEN && wsRef.current.url === newWsUrl) {
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

            const ws = new WebSocket(newWsUrl);
            wsRef.current = ws;

            ws.onopen = () => {
                if (!isMounted) return;
                isConncectingRef.current = false;

                const heartbeat = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
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
                    data.type === "user-message:changed" || 
                    data.type === "user-message:deleted" || 
                    data.type === "user-message:sent"
                ) {
                    queryClient.invalidateQueries({ queryKey: [`user-messages-${receiverId}`] });
                }
            }

            ws.onclose = (event) => {
                if (!isMounted) return;
                if (!currentUserId || currentUserId === "") return;
                if (!receiverId || receiverId === "") return;

                isConncectingRef.current = false;

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

    }, [getSessionToken.data, getSessionToken.isLoading, receiverId, queryClient, setMessage]);

    return wsRef.current;
}
