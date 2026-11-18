import { Query, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../alert/useMessageStore";
import { useUserStore } from "../user_profiles/useUserStore";
import { apiRequest } from "../api";
import type { Users } from "../user_profiles/model";
import { useGroupChatStore } from "../group_chats/useGroupChatStore";
import useGroupMemberWebSocket from "./useGroupMemberWebSocket";
import { useGroupMemberStore } from "./useGroupMemberStore";
import useDebounce from "./useDebounce";

export default function useGroupMemberService() {
    const queryClient = useQueryClient();
    const groupId = useGroupChatStore((state) => state.groupId);

    const searchedGroupMember = useGroupMemberStore((state) => state.searchedGroupMember);
    const search = useDebounce<string>(500, searchedGroupMember.trim());
    
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const currentUserId = useUserStore((state) => state.currentUserId);
    
    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);

    useGroupMemberWebSocket();

    const isGroupOwner = useQuery({
        enabled: !!currentUserId && !!groupId,
        queryFn: async () => {
            const endpoint = `/api/v1/groups/members/owner?group_id=${groupId}`;
            const request = await apiRequest<boolean>(endpoint, { method: "GET" });
            return request.data ?? false;
        },
        queryKey: [`group-owner-${currentUserId}-${groupId}`]
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
            queryClient.invalidateQueries({ 
                predicate: (query) => {
                    const keys = query.queryKey;
                    if (Array.isArray(keys) && keys.length > 0 && typeof keys[0] === "string") {
                        return keys[0].startsWith('current-user') ||
                        keys[0].startsWith(`available-group-${currentUserId}`) ||
                        keys[0].startsWith(`group-member-${roomCode}`);
                    }
                    return false;
                }
            });

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
            const endpoint = search ? 
            `/api/v1/groups/members?group_id=${groupId}&name=${search.trim()}&page=${pageParam}&limit=${16}` : 
            `/api/v1/groups/members?group_id=${groupId}&page=${pageParam}&limit=${16}`;

            const request = await apiRequest<Users[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        queryKey: search ? [`group-member-${groupId}-${search}`] : 
        [`group-member-${groupId}`]
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