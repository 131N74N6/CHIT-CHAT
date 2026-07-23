import type { IRoomProfileService, RoomIntrf } from '../models/room.model';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useRoomStore } from '../stores/room.store';

export default function useRoomProfileService(props?: IRoomProfileService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms/profiles`;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const deleteRoomImage = useRoomStore((state) => state.deleteRoomImage);
    const setDeleteRoomImage = useRoomStore((state) => state.setDeleteRoomImage);
    
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
    
    const oldRoomPicture = useRoomStore((state) => state.oldRoomPicture);
    const setOldRoomPicture = useRoomStore((state) => state.setOldRoomPicture);

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

    const changeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName);
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                if (deleteRoomImage !== null && deleteRoomImage.public_id) {
                    const request = await fetch(`${baseUrl}/rm-pict/${props?.roomId}`, {
                        body: JSON.stringify({ old_image: deleteRoomImage }),
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' },
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${baseUrl}/remake/${props?.roomId}`, {
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
        }
    });

    const { data: detail, error: errorDetail, isLoading: isDetailLoading } = useQuery<RoomIntrf>({
        enabled: !!props?.roomId,
        queryFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/show/${props?.roomId}`, {
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

    const deleteRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm/${props?.roomId}`, {
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
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-chat-${props?.roomId}`) ||
                        queryKey[0].startsWith(`room-member-${props?.roomId}`) ||
                        queryKey[0].startsWith(`available-room-${props?.currentUserId}`) ||
                        queryKey[0].startsWith(`room-profile-${props?.roomId}`);
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

                const request = await fetch(`${baseUrl}/make-room`, {
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
            queryClient.invalidateQueries({ queryKey: [`room-member-${props?.roomId}`] });
            resetRoomState();
            navigate(`/rooms`);
        }
    });

    const isRoomProfileProcessing = changeRoomMt.isPending || currentAvailableRooms.isAvailableRoomLoading || 
    currentRoomProfile.isDetailLoading || deleteRoomMt.isPending || makeRoomMt.isPending;

    return { 
        changeRoomMt,
        currentAvailableRooms,
        currentRoomProfile,
        deleteRoomImage,
        deleteRoomMt,
        description,
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
        setOldRoomPicture, 
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl 
    }
}