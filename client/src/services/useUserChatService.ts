import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ChatIntrf, IFileViewer } from "../models/chat.model";
import { useRef } from "react";
import { useChatStore } from "../stores/chat.store";
import { useMessageStore } from "../stores/message.store";

export default function useUserChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const isSelectMode = useChatStore((state) => state.isSelectMode);
    const setIsSelectMode = useChatStore((state) => state.setIsSelectMode);

    const chatId = useChatStore((state) => state.chatId);

    const receiverId = useChatStore((state) => state.receiverId);
    const setMessage = useMessageStore((state) => state.setMessage);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);

    const selectedIds = useChatStore((state) => state.selectedIds);
    const toggleSelect = useChatStore((state) => state.toggleSelect);
    const clearSelection = useChatStore((state) => state.clearSelection);
    const removeOnePreviewFile = useChatStore((state) => state.remove);

    const showDeleteOption1 = useChatStore((state) => state.showDeleteOption1);
    const setShowDeleteOption1 = useChatStore((state) => state.setShowDeleteOption1);

    const showDeleteOption2 = useChatStore((state) => state.showDeleteOption2);
    const setShowDeleteOption2 = useChatStore((state) => state.setShowDeleteOption2);

    const clearAllUserChatsForMeMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/clears/${receiverId}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
            setShowDeleteOption1(false);
        }
    });
    
    const clearChosenUserChatForMeMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/clear/${receiverId}`, {
                    body: JSON.stringify({ chatsIds: selectedIds }),
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
            setShowDeleteOption2(false);
        }
    });

    const deleteAllUserChatsMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/rm-all/${receiverId}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
            setShowDeleteOption1(false);
        }
    });

    const deleteChosenUsersChatMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/rm/${receiverId}`, {
                    body: JSON.stringify({ chatsIds: selectedIds }),
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
            setShowDeleteOption2(false);
        }
    });

    const editSelectedChatMt = useMutation({
        mutationFn: async (id: string) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/remake/${id}/${receiverId}`, {
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
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
        }
    });

    const handleMediaPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const tempt: IFileViewer[] = [];
        
        if (!files || files.length === 0) return;

        for (let p = 0; p < files.length; p++) {
            tempt.push({
                file: files[p],
                fileName: files[p].name,
                fileType: files[0].type,
                previewUrl: URL.createObjectURL(files[p])
            });
        }
        
        setMedia(prev => [...prev, ...tempt]);
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }

    const sendChatToUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("receiver_id", receiverId!);
                
                if (text.trim()) formData.append("messages", text.trim());
                
                if (media && media.length > 0) {
                    for (let m = 0; m < media.length; m++) {
                        formData.append("media", media[m].file);
                    }
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/send`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setMedia([]);
            clearSelection();
            setShowDeleteOption1(false);
        }
    });

    const { data, error, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } = useInfiniteQuery({
        enabled: !!receiverId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/show-all/${receiverId}?page=${pageParam}&limit=${14}`, {
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
        queryKey: [`user-chat-${receiverId}`],
        initialPageParam: 1,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const getUserChats: ChatIntrf[] = data ? data.pages.flat() : [];
    const userChats = { error, fetchNextPage, getUserChats, isFetchingNextPage, isLoading, hasNextPage }

    const userChatMedia = useQuery({
        enabled: !!chatId && chatId !== "",
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/chats/show-all/media/${chatId}`, {
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: [`user-chat-media-${chatId}`],
        staleTime: Infinity
    });

    const isUserChatProcessing = clearChosenUserChatForMeMt.isPending || clearAllUserChatsForMeMt.isPending || 
    deleteAllUserChatsMt.isPending || deleteChosenUsersChatMt.isPending || editSelectedChatMt.isPending || 
    sendChatToUserMt.isPending;

    return { 
        clearChosenUserChatForMeMt,
        clearAllUserChatsForMeMt,
        clearSelection,
        deleteAllUserChatsMt,
        deleteChosenUsersChatMt,
        editSelectedChatMt,
        handleMediaPreview, 
        inputMediaRef, 
        isSelectMode,
        isUserChatProcessing, 
        media, 
        removeOnePreviewFile,
        sendChatToUserMt, 
        selectedIds,
        setIsSelectMode,
        setMedia, 
        setText, 
        setShowDeleteOption1,
        setShowDeleteOption2,
        showDeleteOption1,
        showDeleteOption2,
        text, 
        toggleSelect,
        userChats, 
        userChatMedia
    }
}