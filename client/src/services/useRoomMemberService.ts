import { Query, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useRoomStore } from "../stores/room.store";
import { useMessageStore } from "../stores/message.store";

export default function useRoomMemberService() {
    const queryClient = useQueryClient();
    const currentUserId = useUserStore((state) => state.currentUserId);
    const roomId = useRoomStore((state) => state.roomId);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const currentRoomMember = useInfiniteQuery({
        enabled: !!roomId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14 ) return;
            allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const url = `${import.meta.env.VITE_BASE_API_URL}/rooms/members`;
                const request = await fetch(`${url}/show-all/${roomId}?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: [`room-member-${roomId}`],
        initialPageParam: 1,
        staleTime: Infinity
    });

    const isRoomOwner = useQuery<boolean>({
        enabled: !!roomId && !!currentUserId,
        queryKey: [`is-room-owner-${currentUserId}-${roomId}`],
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/members/is-room-owner/${roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        staleTime: Infinity
    });

    const kickMemberMt = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/members/kick/${userId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "PUT"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
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
                        queryKey[0].startsWith(`available-room-${currentUserId}`) ||
                        queryKey[0].startsWith(`room-member-${roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const leftRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/members/left-room/${roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "PUT"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
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
                        queryKey[0].startsWith(`available-room-${currentUserId}`) ||
                        queryKey[0].startsWith(`room-member-${roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const isRoomMemberProcessing = currentRoomMember.isLoading || 
    kickMemberMt.isPending || leftRoomMt.isPending || isRoomOwner.isLoading;

    return { currentRoomMember, isRoomOwner, isRoomMemberProcessing, kickMemberMt, leftRoomMt }
}