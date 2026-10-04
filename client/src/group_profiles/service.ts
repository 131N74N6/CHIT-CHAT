import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../stores/message.store";
import { useNavigate } from "react-router-dom";
import type { RoomIntrf } from "../models/room.model";
import { useUserStore } from "../user_profiles/store";
import { useGroupStore } from "./store";
import { useRef } from "react";
import { useGroupChatStore } from "../group_chats/store";
import { apiRequest } from "../api";

export default function useGroupProfileService() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);

    const currentUserId = useUserStore((state) => state.currentUserId);
    const groupId = useGroupChatStore((state) => state.groupId);
    
    const deleteRoomImage = useGroupStore((state) => state.deleteRoomImage);
    const setDeleteRoomImage = useGroupStore((state) => state.setDeleteRoomImage);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resetRoomState = useGroupStore((state) => state.resetRoomState);
    const editMode = useGroupStore((state) => state.editMode);
    const setEditMode = useGroupStore((state) => state.setEditMode);

    const description = useGroupStore((state) => state.description);
    const setDescription = useGroupStore((state) => state.setDescription);

    const roomName = useGroupStore((state) => state.roomName);
    const setRoomName = useGroupStore((state) => state.setRoomName);

    const selectedProfileRoom = useGroupStore((state) => state.selectedProfileRoom);
    const setSelectedProfileRoom = useGroupStore((state) => state.setSelectedProfileRoom);

    const selectedProfileRoomUrl = useGroupStore((state) => state.selectedProfileRoomUrl);
    const setSelectedProfileRoomUrl = useGroupStore((state) => state.setSelectedProfileRoomUrl);
    
    const oldRoomPicture = useGroupStore((state) => state.oldRoomPicture);
    const setOldRoomPicture = useGroupStore((state) => state.setOldRoomPicture);

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
        enabled: !!groupId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/show/${groupId}`, {
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
        queryKey: [`room-profile-${groupId}`],
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
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/rm-pict/${groupId}`, {
                        body: JSON.stringify({ old_image: deleteRoomImage }),
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' },
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/rooms/profiles/remake/${groupId}`, {
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
                        return queryKey[0].startsWith(`room-profile-${groupId}`) ||
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
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups`;
            await apiRequest(endpoint, {
                body: JSON.stringify({ group_id: groupId.trim() }),
                method: "DELETE"
            });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-chat-${groupId}`) ||
                        queryKey[0].startsWith(`room-member-${groupId}`) ||
                        queryKey[0].startsWith(`available-room-${currentUserId}`) ||
                        queryKey[0].startsWith(`room-profile-${groupId}`);
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
            queryClient.invalidateQueries({ queryKey: [`room-member-${groupId}`] });
            resetRoomState();
            navigate(`/rooms`);
        }
    });

    const isRoomProfileProcessing = [changeRoomMt, deleteRoomMt, makeRoomMt].some((feature) => feature.isPending);

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
        selectedProfileRoomUrl
    }
}