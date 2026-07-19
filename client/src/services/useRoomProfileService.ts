import { useQuery } from "@tanstack/react-query";
import type { IRoomProfileService, RoomIntrf } from "../models/room.model";

export default function useRoomProfileService(props?: IRoomProfileService) {
    const { data: detail, error: errorDetail, isLoading: isDetailLoading } = useQuery<RoomIntrf>({
        enabled: !!props?.roomId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/show/${props?.roomId}`, {
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
        queryKey: [`room-profile-${props?.roomId}`],
        staleTime: Infinity
    });

    const currentRoomProfile = { detail, errorDetail, isDetailLoading }

    return { currentRoomProfile }
}