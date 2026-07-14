import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IRoomService } from "../models/room.model";
import { useChatStore } from "../stores/chat.store";
import { useRef } from "react";
import UserServices from "./user.service";

export default function RooServices(props?: IRoomService) {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms`;
    const { currentUser } = UserServices();

    const resetChats = useChatStore((state) => state.resetChats);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const mediaUrl = useChatStore((state) => state.mediaUrl);
    const setMediaUrl = useChatStore((state) => state.setMediaUrl);

    const messages = useChatStore((state) => state.messages);
    const setMessages = useChatStore((state) => state.setMessages);

    const roomId = useChatStore((state) => state.roomId);
    const setRoomId = useChatStore((state) => state.setRoomId);

    const { 
        data: paginatedRoomChats, 
        error: roomChatsError, 
        fetchNextPage: fecthNextRoomChat, 
        hasNextPage: roomChatHasNextPage, 
        isFetchingNextPage: isRoomChatFetchNext, 
        isLoading: isRoomChatLoading, 
    } = useInfiniteQuery({
        enabled: !!props?.roomId || !!roomId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({pageParam = 1}: { pageParam?: number }) => {
            try {const request = await fetch(`${baseUrl}/chat/${props?.roomId}?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
                    method: "GET"
                });
                
                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        initialPageParam: 1,
        queryKey: [`room-chat-${props?.roomId}`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });
    
    const roomChats = paginatedRoomChats ? paginatedRoomChats.pages.flat() : [];
    
    const allChatsInRoom = {
        roomChats,
        roomChatsError,
        fecthNextRoomChat,
        roomChatHasNextPage,
        isRoomChatFetchNext,
        isRoomChatLoading
    }

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

    const roomMember = paginatedRoomMember ? paginatedRoomMember.pages.flat() : [];

    const currentRoomMember = { 
        roomMember, 
        roomMemberError, 
        fetchNextRoomMember, 
        roomMmeberHaveNextPage, 
        isRoomMemberFetchNextPage, 
        isRoomMemberLoading 
    }

    const { 
        data: paginatedAvailableRooms,
        error: availableRoomsError,
        fetchNextPage: fetchNextAvailableRoom,
        isFetchingNextPage: isFetchNextAvailableRoom,
        isLoading: isAvailableRoomLoading,
        hasNextPage: availableRoomHasNextPage
    } = useInfiniteQuery({
        enabled: !!currentUser.user?.user_id,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${baseUrl}/show-all?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
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
        queryKey: [`available-room-${currentUser.user?.user_id}`],
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

    const clearChatInRoomForMeMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/clear/${_id}/${props? props.roomId : roomId}`, {
                    credentials: "include",
                    method: "PUT"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message)
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
            resetChats();
        }
    });

    const clearChatsInRoomForMeMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/clears/${props? props.roomId : roomId}`, {
                    credentials: "include",
                    method: "PUT"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message)
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
            resetChats();
        }
    });

    const deleteAllChatsPermanentlyForRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all/permanently/${props? props.roomId : roomId}`, {
                    credentials: "include",
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
        }
    });

    const deleteAllChatsForRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rooms/rm-all/${props? props.roomId : roomId}`, {
                    credentials: "include",
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
        }
    });

    const deleteChatPermanentlyForRoomMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/rooms/rm/permanently/${_id}/${props? props.roomId : roomId}`, {
                    credentials: "include",
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
        }
    });

    const deleteChaForRoomMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/rooms/rm/${_id}/${props? props.roomId : roomId}`, {
                    credentials: "include",
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
            resetChats();
        }
    });
    
    const sendChatToRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", messages.trim());
                formData.append("room_id", props?.roomId!);

                if (media && media.length > 0) {
                    media.forEach(media => formData.append("media", media));
                }

                const request = await fetch(`${baseUrl}/rooms/to-room`, {
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
            resetChats();
        }
    });

    const isRoomProcessing = clearChatInRoomForMeMt.isPending || clearChatsInRoomForMeMt.isPending ||
    deleteAllChatsPermanentlyForRoomMt.isPending || deleteAllChatsForRoomMt.isPending || 
    deleteChatPermanentlyForRoomMt.isPending || deleteChaForRoomMt.isPending

    return { 
        allChatsInRoom,
        clearChatInRoomForMeMt,
        clearChatsInRoomForMeMt,
        currentAvailableRooms,
        currentRoomMember,
        deleteAllChatsForRoomMt,
        deleteAllChatsPermanentlyForRoomMt,
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        inputMediaRef, 
        isRoomProcessing,
        media,
        mediaUrl,
        messages,
        roomId,
        sendChatToRoomMt, 
        setMedia,
        setMediaUrl,
        setMessages,
        setRoomId
    }
}