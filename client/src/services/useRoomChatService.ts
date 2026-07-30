import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react'
import type { IRoomChatService } from '../models/room.model';
import { useChatStore } from '../stores/chat.store';
import type { ChatIntrf, IFileViewer } from '../models/chat.model';
import { useRoomStore } from '../stores/room.store';

export default function useRoomChatService(props?: IRoomChatService) {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/rooms/chats`;
    const roomId = useRoomStore((state) => state.roomId);
    
    const inputMediaRef = useRef<HTMLInputElement>(null);
    const resetChatState = useChatStore((state) => state.resetChatState);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);
    
    const isSelectMode = useRoomStore((state) => state.isSelectMode);
    const setIsSelectMode = useRoomStore((state) => state.setIsSelectMode);

    const showDeleteOption1 = useRoomStore((state) => state.showDeleteOption1);
    const setShowDeleteOption1 = useRoomStore((state) => state.setShowDeleteOption1);

    const showDeleteOption2 = useRoomStore((state) => state.showDeleteOption2);
    const setShowDeleteOption2 = useRoomStore((state) => state.setShowDeleteOption2);

    const toggleSelect = useRoomStore((state) => state.toggleSelect);
    const removeOnePreviewFile = useChatStore((state) => state.remove);
    
    const showRoomMedia = useRoomStore((state) => state.showRoomMedia);
    const setShowRoomMedia = useRoomStore((state) => state.setShowRoomMedia);

    const selectedChatsIds = useRoomStore((state) => state.selectedChatsIds);
    const clearChatsIdsSelection = useRoomStore((state) => state.clearChatsIdsSelection);

    const { 
        data: paginatedRoomChats, 
        error: roomChatsError, 
        fetchNextPage: fecthNextRoomChat, 
        hasNextPage: roomChatHasNextPage, 
        isFetchingNextPage: isRoomChatFetchNext, 
        isLoading: isRoomChatLoading, 
    } = useInfiniteQuery({
        enabled: !!roomId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({pageParam = 1}: { pageParam?: number }) => {
            try {const request = await fetch(`${baseUrl}/show-all/${roomId}?page=${pageParam}&limit=${14}`, {
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
        queryKey: [`room-chat-${roomId}`],
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
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/clears/${roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "DELETE"
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            setText("");
            setMedia([]);
            clearChatsIdsSelection();
            setShowDeleteOption1(false);
        }
    });

    const clearChosenRoomChatsForMeMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/clear/${roomId}`, {
                    body: JSON.stringify({ chatsIds: selectedChatsIds }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "DELETE"
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            setText("");
            setMedia([]);
            clearChatsIdsSelection();
            setShowDeleteOption2(false);
        }
    });

    const deleteAllChatsInRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all/${roomId}`, {
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            setText("");
            setMedia([]);
            clearChatsIdsSelection();
            setShowDeleteOption1(false);
        }
    });

    const deleteChosenChatsInRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm/${roomId}`, {
                    body: JSON.stringify({ chatsIds: selectedChatsIds }),
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            setText("");
            setMedia([]);
            clearChatsIdsSelection();
            setShowDeleteOption2(false);
        }
    });

    const editSelectedChatMt = useMutation({
        mutationFn: async (id: string) => {
            try {
                const request = await fetch(`${baseUrl}/remake/${id}/${roomId}`, {
                    body: JSON.stringify({ text: text.trim() }),
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            setText("");
            setMedia([]);
            clearChatsIdsSelection();
            setShowDeleteOption1(false);
        }
    });

    const handleMediaPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    const sendChatToRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", text.trim());
                formData.append("room_id", roomId!);

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
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            resetChatState();
        }
    });

    const isRoomChatProcessing = clearAllRoomChatsForMeMt.isPending || clearChosenRoomChatsForMeMt.isPending ||
    deleteAllChatsInRoomMt.isPending || deleteChosenChatsInRoomMt.isPending || allChatsInRoom.isRoomChatLoading || 
    sendChatToRoomMt.isPending || editSelectedChatMt.isPending;

    return { 
        allChatsInRoom, 
        clearAllRoomChatsForMeMt, 
        clearChatsIdsSelection,
        clearChosenRoomChatsForMeMt, 
        deleteAllChatsInRoomMt,
        deleteChosenChatsInRoomMt,
        editSelectedChatMt,
        handleMediaPreview,
        inputMediaRef,
        isRoomChatProcessing,
        isSelectMode,
        media,
        removeOnePreviewFile,
        selectedChatsIds,
        sendChatToRoomMt,
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        setShowRoomMedia,
        showDeleteOption1,
        showDeleteOption2,
        showRoomMedia,
        setMedia,
        setText,
        text, 
        toggleSelect
    }
}