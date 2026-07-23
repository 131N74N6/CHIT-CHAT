import { Query, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IRoomMemberService } from "../models/room.model";
import type { IOtherUser } from "../models/user.model";

export default function useRoomMemberService(props?: IRoomMemberService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms/members`;
    const queryClient = useQueryClient();
    
    const { 
        data: paginatedRoomMember, 
        error: roomMemberError,
        fetchNextPage: fetchNextRoomMember,
        isFetchingNextPage: isRoomMemberFetchNextPage,
        hasNextPage: roomMmeberHaveNextPage,
        isLoading: isRoomMemberLoading 
    } = useInfiniteQuery({
        enabled: !!props?.roomId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14 ) return;
            allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${baseUrl}/show-all/${props?.roomId}?page=${pageParam}&limit=${14}`, {
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
        queryKey: [`room-member-${props?.roomId}`],
        initialPageParam: 1,
        staleTime: Infinity
    });

    const roomMember: IOtherUser[] = paginatedRoomMember ? paginatedRoomMember.pages.flat() : [];

    const currentRoomMember = { 
        roomMember, 
        roomMemberError, 
        fetchNextRoomMember, 
        roomMmeberHaveNextPage, 
        isRoomMemberFetchNextPage, 
        isRoomMemberLoading 
    }

    const kickMemberMt = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const request = await fetch(`${baseUrl}/kick/${userId}`, {
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
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query:Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`available-room-`) ||
                        queryKey[0].startsWith(`room-chat-${props?.roomId}`) ||
                        queryKey[0].startsWith(`room-member-${props?.roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const leftRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/left-room/${props?.roomId}`, {
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
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`available-room-`) ||
                        queryKey[0].startsWith(`room-member-${props?.roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const isRoomMemberProcessing = currentRoomMember.isRoomMemberLoading || 
    kickMemberMt.isPending || leftRoomMt.isPending;

    return { currentRoomMember, kickMemberMt, isRoomMemberProcessing, leftRoomMt }
}