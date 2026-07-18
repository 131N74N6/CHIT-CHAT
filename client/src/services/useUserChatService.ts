import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ChatIntrf, IUserChatService } from "../models/chat.model";
import { useRef } from "react";
import { useChatStore } from "../stores/chat.store";

export default function useUserChatService(props: IUserChatService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/chats`;
    const queryClient = useQueryClient();

    const inputMediaRef = useRef<HTMLInputElement>(null);
    const resetChats = useChatStore((state) => state.resetChats);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const mediaUrl = useChatStore((state) => state.mediaUrl);
    const setMediaUrl = useChatStore((state) => state.setMediaUrl);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);
    
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
    
    const deleteAllChatsPermanentlyForUsererMt = useMutation({
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

    const deleteAllChatsForUsererMt = useMutation({
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

    const deleteChatPermanentlyForUserMt = useMutation({
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

    const deleteChatForUserMt = useMutation({
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
    
    const isReceiverValid = !!props?.receiverId;

    const { data, error, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } = useInfiniteQuery({
        enabled: isReceiverValid,
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

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const urls: string[] = [];
        
        if (!files || files.length === 0) return;
        
        setMedia(files);

        if (media && media.length > 0) {
            for (let a = 0; a < media.length; a++) {
                const previewUrl = URL.createObjectURL(media[a] as Blob);
                urls.push(previewUrl);
            }
        }
        
        setMediaUrl(urls);
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }
    
    const sendChatToUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", text.trim());
                formData.append("receiver_id", props?.receiverId!);

                if (media && media.length > 0) {
                    for (let m = 0; m < media.length; m++) {
                        formData.append("media", media[m]);
                    }
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

    const getUserChats: ChatIntrf[] = data ? data.pages.flat() : [];
    const userChats = { error, fetchNextPage, getUserChats, isFetchingNextPage, isLoading, hasNextPage }

    const isUserChatProcessing = clearChatForMeMt.isPending || clearChatsForMeMt.isPending || 
    deleteAllChatsForUsererMt.isPending || deleteAllChatsPermanentlyForUsererMt.isPending || 
    deleteChatForUserMt.isPending || deleteChatPermanentlyForUserMt.isPending ||
    sendChatToUserMt.isPending;

    return { 
        clearChatForMeMt,
        clearChatsForMeMt,
        deleteAllChatsForUsererMt,
        deleteAllChatsPermanentlyForUsererMt,
        deleteChatForUserMt,
        deleteChatPermanentlyForUserMt,
        handleImagePreview, 
        inputMediaRef, 
        isUserChatProcessing, 
        media, 
        mediaUrl,
        sendChatToUserMt, 
        setMedia, 
        setMediaUrl, 
        setText, 
        text, 
        userChats 
    }
}