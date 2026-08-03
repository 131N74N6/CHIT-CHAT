import type { RoomIntrf } from '../models/room.model';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useRoomStore } from '../stores/room.store';
import { useUserStore } from '../stores/user.store';
import { useMessageStore } from '../stores/message.store';

export default function useRoomProfileService() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);

    const currentUserId = useUserStore((state) => state.currentUserId);
    const roomId = useRoomStore((state) => state.roomId);
    
    const deleteRoomImage = useRoomStore((state) => state.deleteRoomImage);
    const setDeleteRoomImage = useRoomStore((state) => state.setDeleteRoomImage);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resetRoomState = useRoomStore((state) => state.resetRoomState);
    const editMode = useRoomStore((state) => state.editMode);
    const setEditMode = useRoomStore((state) => state.setEditMode);

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

    const availableRooms = useInfiniteQuery({
        enabled: !!currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/show-all?page=${pageParam}&limit=${14}`, {
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
        queryKey: [`available-room-${currentUserId}`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const currentRoomProfile = useQuery<RoomIntrf>({
        enabled: !!roomId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/show/${roomId}`, {
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
        queryKey: [`room-profile-${roomId}`],
        staleTime: Infinity
    });

    const changeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName);
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                if (deleteRoomImage !== null && deleteRoomImage.public_id) {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/rm-pict/${roomId}`, {
                        body: JSON.stringify({ old_image: deleteRoomImage }),
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' },
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/remake/${roomId}`, {
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
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-profile-${roomId}`) ||
                        queryKey[0].startsWith(`available-room-${currentUserId}`);
                    }
                    return false;
                }
            });
            resetRoomState();
        }
    });

    const deleteRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/rm/${roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "DELETE"
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
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-chat-${roomId}`) ||
                        queryKey[0].startsWith(`room-member-${roomId}`) ||
                        queryKey[0].startsWith(`available-room-${currentUserId}`) ||
                        queryKey[0].startsWith(`room-profile-${roomId}`);
                    }
                    return false;
                }
            });
        }
    });
    
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

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/make-room`, {
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
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomId}`] });
            resetRoomState();
            navigate(`/rooms`);
        }
    });

    const isRoomProfileProcessing = changeRoomMt.isPending || availableRooms.isLoading || 
    currentRoomProfile.isLoading || deleteRoomMt.isPending || makeRoomMt.isPending;

    return { 
        availableRooms,
        changeRoomMt,
        currentRoomProfile,
        deleteRoomImage,
        deleteRoomMt,
        description,
        editMode,
        fileInputRef, 
        handleImagePreview,
        isRoomProfileProcessing, 
        makeRoomMt, 
        oldRoomPicture,
        resetRoomState,
        roomName,
        selectedProfileRoom,
        selectedProfileRoomUrl,
        setDeleteRoomImage,
        setDescription,
        setEditMode,
        setOldRoomPicture, 
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl 
    }
}