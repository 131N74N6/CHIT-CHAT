import { useCallback, useEffect, useRef } from "react";
import { useMessageStore } from "../alert/store";
import { useGroupChatStore } from "../group_chats/store";
import { useUserStore } from "../user_profiles/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../api";

function buildWsUrl(backend_url: string, group_id: string, token: string) {
    const wsProtocol = backend_url.startsWith("https") ? "wss:" : "ws:";
    const host = backend_url.replace(/^https?:\/\//, "");
    const encodedToken = encodeURIComponent(token);
    const wsUrl = `${wsProtocol}//${host}/api/v1/groups/members/ws/${group_id}?token=${encodedToken}`;
    return wsUrl;
}

export default function useGroupMemberWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    const connect = useCallback(() => {
        if (!getSessionToken.data || getSessionToken.isLoading) return;
        if (!groupId) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("Authentication failed");
            return;
        }

        const wsUrl = buildWsUrl(`${import.meta.env.VITE_BASE_API_URL}`, groupId, token);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "pong") return;

            if (data.type === "error") {
                setMessage(data.message);
                return;
            }

            if (
                data.type === "member:joined" || 
                data.type === "member:kicked" || 
                data.type === "member:left"
            ) {
                queryClient.invalidateQueries({
                    predicate: (query) => {
                        const key = query.queryKey[0];
                        if (typeof key !== "string") return false;

                        return key.startsWith(`group-member-${groupId}`);
                    }
                });
            }
        }

        ws.onclose = () => {
            reconnectTimeoutRef.current = setTimeout(() => connect, 3000);
        }

        ws.onerror = () => {
            ws.close();
        }
    }, [groupId, queryClient]);

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