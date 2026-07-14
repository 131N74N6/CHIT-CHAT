import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../stores/chat.store";
import { useRef } from "react";
import type { IChatService } from "../models/chat.model";

export default function ChatServices(props?: IChatService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/chats`;
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const resetChats = useChatStore((state) => state.resetChats);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const mediaUrl = useChatStore((state) => state.mediaUrl);
    const setMediaUrl = useChatStore((state) => state.setMediaUrl);

    const messages = useChatStore((state) => state.messages);
    const setMessages = useChatStore((state) => state.setMessages);

    const receiverId = useChatStore((state) => state.receiverId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);

    const clearChatForMeMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/clear/${_id}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const clearChatsForMeMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/clears/${props?.receiverId}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const deleteAllChatsPermanentlyForReceiverMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all/permanently`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const deleteAllChatsForReceiverMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const deleteChatPermanentlyForReceiverMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/rm/permanently/${_id}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const deleteChatForReceiverMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${baseUrl}/rm/${_id}`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const { data, error, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } = useInfiniteQuery({
        enabled: !!props?.receiverId || !!receiverId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            try {
                const request = await fetch(`${baseUrl}/show-all/${props?.receiverId}?page=${pageParam}&limit=${14}`, {
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
        queryKey: [`user-chat-${props?.receiverId}`],
        initialPageParam: 1,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const getUserChats = data ? data.pages.flat() : [];

    const sendChatToUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", messages.trim());
                formData.append("receiver_id", props?.receiverId!);

                if (media && media.length > 0) {
                    media.forEach(media => formData.append("media", media));
                }

                const request = await fetch(`${baseUrl}/to-user`, {
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
            queryClient.invalidateQueries({ queryKey: [`user-chat-${props?.receiverId}`] });
            resetChats();
        }
    });

    const isChatProcessing = sendChatToUserMt.isPending || isLoading || clearChatForMeMt.isPending || 
    clearChatsForMeMt.isPending || deleteAllChatsForReceiverMt.isPending || 
    deleteAllChatsPermanentlyForReceiverMt.isPending || deleteChatForReceiverMt.isPending || 
    deleteChatPermanentlyForReceiverMt.isPending;

    const userChats = { error, fetchNextPage, getUserChats, isFetchingNextPage, isLoading, hasNextPage }

    return {
        clearChatForMeMt,
        clearChatsForMeMt,
        deleteChatForReceiverMt,
        deleteChatPermanentlyForReceiverMt,
        deleteAllChatsForReceiverMt,
        deleteAllChatsPermanentlyForReceiverMt,
        inputMediaRef,
        isChatProcessing,
        media,
        mediaUrl,
        receiverId,
        sendChatToUserMt,
        setMedia,
        setMediaUrl,
        setMessages,
        setReceiverId,
        userChats
    }
}