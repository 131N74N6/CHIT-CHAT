import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react'
import type { IRoomChatService } from '../models/room.model';
import { useChatStore } from '../stores/chat.store';
import type { ChatIntrf } from '../models/chat.model';

export default function roomChatService(props: IRoomChatService) {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms`;
    
    const inputMediaRef = useRef<HTMLInputElement>(null);
    const resetChats = useChatStore((state) => state.resetChats);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const mediaUrl = useChatStore((state) => state.mediaUrl);
    const setMediaUrl = useChatStore((state) => state.setMediaUrl);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);

    const { 
        data: paginatedRoomChats, 
        error: roomChatsError, 
        fetchNextPage: fecthNextRoomChat, 
        hasNextPage: roomChatHasNextPage, 
        isFetchingNextPage: isRoomChatFetchNext, 
        isLoading: isRoomChatLoading, 
    } = useInfiniteQuery({
        enabled: !!props?.roomId,
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
    
    const roomChats: ChatIntrf[] = paginatedRoomChats ? paginatedRoomChats.pages.flat() : [];
    
    const allChatsInRoom = {
        roomChats,
        roomChatsError,
        fecthNextRoomChat,
        roomChatHasNextPage,
        isRoomChatFetchNext,
        isRoomChatLoading
    }

    const clearChatInRoomForMeMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/clear/${_id}/${props?.roomId}`, {
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
                const request = await fetch(`${baseUrl}/clears/${props?.roomId}`, {
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
                const request = await fetch(`${baseUrl}/rm-all/permanently/${props?.roomId}`, {
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
                const request = await fetch(`${baseUrl}/rooms/rm-all/${props?.roomId}`, {
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
                const request = await fetch(`${baseUrl}/rooms/rm/permanently/${_id}/${props?.roomId}`, {
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
                const request = await fetch(`${baseUrl}/rooms/rm/${_id}/${props?.roomId}`, {
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

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files;
        const urls: string[] = [];
        
        if (file && file.length > 0) setMedia(file);

        if (media && media.length > 0) {
            for (let a = 0; a < media.length; a++) {
                const previewUrl = URL.createObjectURL(media[a] as Blob);
                urls.push(previewUrl);
            }
        }
        
        setMediaUrl(urls);
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }
    
    const sendChatToRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", text.trim());
                formData.append("room_id", props?.roomId!);

                if (media && media.length > 0) {
                    for (let t = 0; t < media.length; t++) {
                        formData.append("media", media[t]);
                    }
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

    const isRoomChatProcessing = clearChatInRoomForMeMt.isPending || clearChatsInRoomForMeMt.isPending ||
    deleteAllChatsForRoomMt.isPending || deleteAllChatsPermanentlyForRoomMt.isPending || deleteChaForRoomMt.isPending ||
    deleteChatPermanentlyForRoomMt.isPending || allChatsInRoom.isRoomChatLoading || sendChatToRoomMt.isPending;

    return { 
        allChatsInRoom, 
        clearChatInRoomForMeMt, 
        clearChatsInRoomForMeMt, 
        deleteAllChatsForRoomMt,
        deleteAllChatsPermanentlyForRoomMt,
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        handleImagePreview,
        inputMediaRef,
        isRoomChatProcessing,
        media,
        mediaUrl,
        setMedia,
        setMediaUrl,
        setText,
        text 
    }
}