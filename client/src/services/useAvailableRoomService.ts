import { useInfiniteQuery } from '@tanstack/react-query';
import type { IAvailableRoomService } from '../models/room.model';

export default function useAvailableRoomService(props?: IAvailableRoomService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms/profiles`;

    const { 
        data: paginatedAvailableRooms,
        error: availableRoomsError,
        fetchNextPage: fetchNextAvailableRoom,
        isFetchingNextPage: isFetchNextAvailableRoom,
        isLoading: isAvailableRoomLoading,
        hasNextPage: availableRoomHasNextPage
    } = useInfiniteQuery({
        enabled: !!props?.currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${baseUrl}/show-all?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });
                
                const response = await request.json();
                if (!request.ok) throw new Error(response.message)
                    return response;
            } catch (error) {
                throw error;
            }
        },
        initialPageParam: 1,
        queryKey: [`available-room-${props?.currentUserId}`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const availableRooms = paginatedAvailableRooms ? paginatedAvailableRooms.pages.flat() : [];

    const currentAvailableRooms = {
        availableRooms,
        availableRoomsError,
        fetchNextAvailableRoom,
        isFetchNextAvailableRoom,
        isAvailableRoomLoading,
        availableRoomHasNextPage
    }

    return { currentAvailableRooms }
}