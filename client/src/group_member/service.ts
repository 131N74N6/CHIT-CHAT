import { Query, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../alert/store";
import { useUserStore } from "../user_profiles/store";
import { apiRequest } from "../api";
import type { Users } from "../user_profiles/model";
import { useGroupChatStore } from "../group_chats/store";
import { useEffect } from "react";
import { groupMemberWebSocket } from "./event";

export default function useGroupMemberService() {
    const queryClient = useQueryClient();
    const groupId = useGroupChatStore((state) => state.groupId);

    const setMessage = useMessageStore((state) => state.setMessage);
    
    const currentUserId = useUserStore((state) => state.currentUserId);

    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);

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
        if (!currentUserId || !groupId) return;
        if (getSessionToken.isLoading && !getSessionToken.data) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("authentication failed");
            return;
        }

        const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
        groupMemberWebSocket.enableReconnect();
        groupMemberWebSocket.connect(baseApiUrl, groupId, token);

        const handleConnection = (payload: any) => {
            setMessage(payload.message);
        }

        const handleMessage = (payload: any) => {
            if (payload.type === "error") {
                setMessage(payload.message);
                return;
            }

            const queryKey = [`group-member-${groupId}`];

            if (payload.type === "member:joined") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;

                    const newMemberData = old.pages.map((page: any[]) => {
                        return page.map((message) => message.group_ids.push(payload.data));
                    });

                    return { ...old, pages: newMemberData };
                });
            } else if (payload.type === "member:kicked" || payload.type === "member:left") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;

                    const newMemberData = old.pages.map((page: any[]) => {
                        return page.filter((message) => message._id !== payload.data);
                    });

                    return { ...old, pages: newMemberData };
                });
            } else if (payload.type === "member-profile:changed") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return old;

                    const newMemberData = old.pages.map((page: any[]) => {
                        return page.map((message: any) => {
                            if (payload.data.includes(message._id)) {
                                return { ...message, name: payload.data.name }
                            }
                            return message;
                        });
                    });
                    
                    return { ...old, pages: newMemberData };
                });
            } else if (payload.type === "member-profile-picture:deleted") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return old;

                    const newMemberData = old.pages.map((page: any[]) => {
                        return page.map((message: any) => {
                            if (payload.data.includes(message._id)) {
                                return { 
                                    ...message, 
                                    image: payload.data.image,
                                    image_public_id: payload.data.image_public_id 
                                }
                            }
                            return message;
                        });
                    });
                    
                    return { ...old, pages: newMemberData };
                });
            }

            const handleDisconnect = () => {
                //
            }
            
            const handleError = (payload: any) => {
                const message = payload.message;
                setMessage(message);
    
                if (message.includes("not allowed") || message.includes("Invalid user")) {
                    groupMemberWebSocket.disconnect();
                }
            }

            const handleReconnecting = (payload: any) => {
                setMessage(payload.message);
            }
            
            const handleMaxRetries = (payload: any) => {
                setMessage(payload.message);
                groupMemberWebSocket.disconnect();
            }

            groupMemberWebSocket.on("connect", handleConnection);
            groupMemberWebSocket.on("message", handleMessage);
            groupMemberWebSocket.on("reconnecting", handleReconnecting);
            groupMemberWebSocket.on("max_retried", handleMaxRetries);
            groupMemberWebSocket.on("error", handleError);
            groupMemberWebSocket.on("disconnected", handleDisconnect);

            return () => {
                groupMemberWebSocket.off("disconnected", handleDisconnect);
                groupMemberWebSocket.off("connect", handleConnection);
                groupMemberWebSocket.off("message", handleMessage);
                groupMemberWebSocket.off("reconnecting", handleReconnecting);
                groupMemberWebSocket.off("max_retried", handleMaxRetries);
                groupMemberWebSocket.off("error", handleError);
            }
        }
    }, [currentUserId, groupId,  getSessionToken.data, getSessionToken.isLoading, getSessionToken.error, setMessage]);

    const isGroupOwner = useQuery({
        enabled: !!currentUserId && !!groupId,
        queryFn: async () => {
            const endpoint = `/api/v1/groups/members/owner?group_id=${groupId}`;
            const request = await apiRequest<boolean>(endpoint, { method: "GET" });
            return request.data ?? false;
        },
        queryKey: [`group-owner-${currentUserId}-${groupId}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    const joinGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/members`;
            const data = JSON.stringify({ group_id: roomCode.trim() });
            await apiRequest(endpoint, { body: data, method: "POST" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`available-group-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`group-member-${roomCode}`] });
            setRoomCode("");
        }
    });

    const kickMemberMt = useMutation({
        mutationFn: async (userId: string) => {
            const endpoint = `/api/v1/groups/members/kick`;
            const data = JSON.stringify({ group_id: groupId, user_id: userId });
            await apiRequest(endpoint, { body: data, method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query:Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`) ||
                        queryKey[0].startsWith(`group-member-${groupId}`);
                    }
                    return false;
                }
            });
        }
    });

    const leftGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/members/left?group_id=${groupId}`;
            const request = await apiRequest(endpoint, { method: "PUT" });
            return request.data;
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`) ||
                        queryKey[0].startsWith(`group-member-${groupId}`);
                    }
                    return false;
                }
            });
        }
    });

    const showGroupMembers = useInfiniteQuery({
        enabled: !!groupId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 16 ) return;
            allPages.length + 1;
        },
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            const endpoint = `/api/v1/groups/members?group_id=${groupId}&page=${pageParam}&limit=${16}`;
            const request = await apiRequest<Users[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        queryKey: [`group-member-${groupId}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const isProcessing = [joinGroupMt, kickMemberMt, leftGroupMt].some(feature => feature.isPending);

    return {
        isGroupOwner,
        isProcessing,
        joinGroupMt,
        kickMemberMt,
        leftGroupMt,
        showGroupMembers
    }
}