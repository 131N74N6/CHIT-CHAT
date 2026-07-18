import { useInfiniteQuery } from "@tanstack/react-query";
import type { IRoomMemberService } from "../models/room.model";
import type { IOtherUser } from "../models/user.model";

export default function useRoomMemberService(props?: IRoomMemberService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms`;
    
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
                const request = await fetch(`${baseUrl}/member/${props?.roomId}?page=${pageParam}&limit=${14}`, {
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

    return { currentRoomMember }
}