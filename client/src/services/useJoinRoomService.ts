import type { IJoinRoom } from "../models/room.model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";

export default function useJoinRoomService(props?: IJoinRoom) {
    const queryClient = useQueryClient();
    
    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);
    
    const joinRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/join-room`, {
                    body: JSON.stringify({ room_code: roomCode.trim() }),
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
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
        }
    });

    const isJoinRoomProcessing = joinRoomMt.isPending;

    return { isJoinRoomProcessing, joinRoomMt, roomCode, setRoomCode }
}