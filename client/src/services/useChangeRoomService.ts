import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../stores/room.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import type { IChangeRoom, RoomIntrf } from "../models/room.model";

export default function useChangeRoomService(props?: IChangeRoom) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resetRoomState = useRoomStore((state) => state.resetRoomState);

    const deleteRoomImage = useRoomStore((state) => state.deleteRoomImage);
    const setDeleteRoomImage = useRoomStore((state) => state.setDeleteRoomImage);

    const description = useRoomStore((state) => state.description);
    const setDescription = useRoomStore((state) => state.setDescription);

    const roomName = useRoomStore((state) => state.roomName);
    const setRoomName = useRoomStore((state) => state.setRoomName);

    const selectedProfileRoom = useRoomStore((state) => state.selectedProfileRoom);
    const setSelectedProfileRoom = useRoomStore((state) => state.setSelectedProfileRoom);

    const selectedProfileRoomUrl = useRoomStore((state) => state.selectedProfileRoomUrl);
    const setSelectedProfileRoomUrl = useRoomStore((state) => state.setSelectedProfileRoomUrl);
    
    const oldRoomPicture = useRoomStore((state) => state.oldRoomPicture);
    const setOldRoomPicture = useRoomStore((state) => state.setOldRoomPicture);

    const changeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName);
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                if (deleteRoomImage !== null && deleteRoomImage.public_id) {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/rm-room-pict/${props?.roomId}`, {
                        body: JSON.stringify({ old_image: deleteRoomImage }),
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' },
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/remake-room/${props?.roomId}`, {
                    body: formData,
                    credentials: "include",
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
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-profile-${props?.roomId}`) ||
                        queryKey[0].startsWith(`available-room-${props?.currentUserId}`);
                    }
                    return false;
                }
            });
            resetRoomState();
            navigate(`/room/profile/${props?.roomId}`)
        }
    });

    const { data: detail, error: errorDetail, isLoading: isDetailLoading } = useQuery<RoomIntrf>({
        enabled: !!props?.roomId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profile/${props?.roomId}`, {
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

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedProfileRoom(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedProfileRoomUrl(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const isChangeRoomProcessing = changeRoomMt.isPending;

    return {
        changeRoomMt,
        currentRoomProfile,
        deleteRoomImage,
        fileInputRef,
        description,
        handleImagePreview,
        isChangeRoomProcessing,
        oldRoomPicture,
        resetRoomState,
        roomName,
        selectedProfileRoom,
        selectedProfileRoomUrl,
        setDeleteRoomImage,
        setDescription,
        setOldRoomPicture,
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl
    }
}