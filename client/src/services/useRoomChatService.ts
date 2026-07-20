import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react'
import type { IRoomChatService } from '../models/room.model';
import { useChatStore } from '../stores/chat.store';
import type { ChatIntrf, IFileViewer } from '../models/chat.model';
import { useRoomStore } from '../stores/room.store';

export default function useRoomChatService(props?: IRoomChatService) {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms/chats`;
    
    const inputMediaRef = useRef<HTMLInputElement>(null);
    const resetRoomState = useRoomStore((state) => state.resetRoomState);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);
    
    const userChatsIdsToDelete = useRoomStore((state) => state.userChatsIdsToDelete);
    const setUserChatsIdsToDelete = useRoomStore((state) => state.setUserChatsIdsToDelete);

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

    const clearAllRoomChatsForMeMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/clears/${props?.roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
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
            resetRoomState();
        }
    });

    const clearChosenRoomChatsForMeMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/clear/${props?.roomId}`, {
                    body: JSON.stringify({ chatsIds: userChatsIdsToDelete }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
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
            resetRoomState();
        }
    });

    const deleteAllChatsInRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all/${props?.roomId}`, {
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
        }
    });

    const deleteChosenChatsInRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm/${props?.roomId}`, {
                    body: JSON.stringify({ chatsIds: userChatsIdsToDelete }),
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${props?.roomId}`] });
            resetRoomState();
        }
    });

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const temp: IFileViewer[] = [];

        if (!files || files.length === 0) return;

        for (let x = 0; x < files.length; x++) {
            temp.push({
                file: files[x],
                fileName: files[x].name,
                fileType: files[x].type,
                previewUrl: URL.createObjectURL(files[x])
            });
        }

        setMedia(prev => [...prev, ...temp]);
        
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }

    const resetSelectedChat = () => {
        setUserChatsIdsToDelete([]);
    }

    const selectedChatToDelete = (id: string) => {
        const temp: string[] = [];
        temp.push(id);
        setUserChatsIdsToDelete((prev) => [...prev, ...temp]);
    }
    
    const sendChatToRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", text.trim());
                formData.append("room_id", props?.roomId!);

                if (media && media.length > 0) {
                    for (let t = 0; t < media.length; t++) {
                        formData.append("media", media[t].file);
                    }
                }

                const request = await fetch(`${baseUrl}/send`, {
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
            resetRoomState();
        }
    });

    const isRoomChatProcessing = clearAllRoomChatsForMeMt.isPending || clearChosenRoomChatsForMeMt.isPending ||
    deleteAllChatsInRoomMt.isPending || deleteChosenChatsInRoomMt.isPending || allChatsInRoom.isRoomChatLoading || 
    sendChatToRoomMt.isPending;

    return { 
        allChatsInRoom, 
        clearAllRoomChatsForMeMt, 
        clearChosenRoomChatsForMeMt, 
        deleteAllChatsInRoomMt,
        deleteChosenChatsInRoomMt,
        handleImagePreview,
        inputMediaRef,
        isRoomChatProcessing,
        media,
        resetSelectedChat,
        selectedChatToDelete,
        sendChatToRoomMt,
        setMedia,
        setText,
        text 
    }
}