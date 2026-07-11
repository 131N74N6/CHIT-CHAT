import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "../stores/chat.store";
import { useRef } from "react";
import type { IChatService } from "../models/chat.model";

export default function ChatServices(props?: IChatService) {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const resetChats = useChatStore((state) => state.resetChats);

    const media = useChatStore((state) => state.media);
    const setMedia = useChatStore((state) => state.setMedia);

    const mediaUrl = useChatStore((state) => state.mediaUrl);
    const setMediaUrl = useChatStore((state) => state.setMediaUrl);

    const messages = useChatStore((state) => state.messages);
    const setMessages = useChatStore((state) => state.setMessages);

    const sendChatToUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", messages.trim());
                formData.append("receiver_id", props?.receiverId!);

                if (media && media.length > 0) {
                    media.forEach(media => formData.append("media", media));
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/to-user`, {
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

    const sendChatToRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("messages", messages.trim());
                formData.append("room_id", props?.roomId!);

                if (media && media.length > 0) {
                    media.forEach(media => formData.append("media", media));
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/to-room`, {
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

    const deleteAllChatsPermanentlyForReceiverMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/user/rm-all/permanently`, {
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
        }
    });

    const deleteAllChatsForReceiverMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/user/rm-all`, {
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
        }
    });

    const deleteChatPermanentlyForReceiverMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/user/rm/permanently/${_id}`, {
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
        }
    });

    const deleteChaForReceiverMt = useMutation({
        mutationFn: async (_id: string) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/user/rm/${_id}`, {
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
        }
    });

    const deleteAllChatsPermanentlyForRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/room/rm-all/permanently/${props?.roomId}`, {
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
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/room/rm-all/${props?.roomId}`, {
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
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/room/rm/permanently/${_id}/${props?.roomId}`, {
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
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/room/rm/${_id}/${props?.roomId}`, {
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

    return {
        deleteChaForReceiverMt,
        deleteChatPermanentlyForReceiverMt,
        deleteAllChatsForReceiverMt,
        deleteAllChatsPermanentlyForReceiverMt,
        deleteAllChatsForRoomMt,
        deleteAllChatsPermanentlyForRoomMt,
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        inputMediaRef,
        media,
        mediaUrl,
        sendChatToRoomMt,
        sendChatToUserMt,
        setMedia,
        setMediaUrl,
        setMessages
    }
}