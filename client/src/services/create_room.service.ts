import type { ICreateRoom } from '../models/room.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useRoomStore } from '../stores/room.store';

export default function createRoomService(props?: ICreateRoom) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resetRoomState = useRoomStore((state) => state.resetRoomState);

    const description = useRoomStore((state) => state.description);
    const setDescription = useRoomStore((state) => state.setDescription);

    const roomName = useRoomStore((state) => state.roomName);
    const setRoomName = useRoomStore((state) => state.setRoomName);

    const selectedProfileRoom = useRoomStore((state) => state.selectedProfileRoom);
    const setSelectedProfileRoom = useRoomStore((state) => state.setSelectedProfileRoom);

    const selectedProfileRoomUrl = useRoomStore((state) => state.selectedProfileRoomUrl);
    const setSelectedProfileRoomUrl = useRoomStore((state) => state.setSelectedProfileRoomUrl);
    
    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedProfileRoom(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedProfileRoomUrl(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
        
    const makeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName.trim());
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/make-room`, {
                    body: formData,
                    credentials: "include",
                    method: "POST"
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
            queryClient.invalidateQueries({ queryKey: [`available-room-${props?.currentUserId}`] });
            resetRoomState();
            navigate(`/rooms`);
        }
    });

    const isMakeRoomProcessing = makeRoomMt.isPending;

    return { 
        description,
        fileInputRef, 
        handleImagePreview,
        isMakeRoomProcessing, 
        makeRoomMt, 
        resetRoomState,
        roomName,
        selectedProfileRoom,
        selectedProfileRoomUrl,
        setDescription, 
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl 
    }
}