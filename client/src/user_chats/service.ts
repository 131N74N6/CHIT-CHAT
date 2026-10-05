import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useUserChatStore } from "./store";
import { useMessageStore } from "../stores/message.store";
import { apiRequest, apiUpload } from "../api";
import type { IFilePreview, IUserChat, IUserChatFiles } from "./model";
import { useUserStore } from "../user_profiles/store";
import { userChatWebSocket } from "./event";

export default function useUserChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const chosenMessageId = useUserChatStore((state) => state.chosenMessageId);
    const setSelectMode = useUserChatStore((state) => state.setSelectMode);

    const receiverId = useUserChatStore((state) => state.receiverId);
    const chosenFiles = useUserChatStore((state) => state.chosenFiles);
    const setChosenFiles = useUserChatStore((state) => state.setChosenFiles);

    const text = useUserChatStore((state) => state.text);
    const setText = useUserChatStore((state) => state.setText);

    const resetChosenMessageIds = useUserChatStore((state) => state.resetChosenMessageIds);

    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);
    const setOpenPopUpOption = useUserChatStore((state) => state.setOpenPopUpOption);

    const currentUserId = useUserStore((state) => state.currentUserId);
    const setMessage = useMessageStore((state) => state.setMessage);

    const getSessionToken = useQuery({
        enabled: !!currentUserId,
        queryFn: async () => {
            const response = await apiRequest<string>("/api/v1/users/session", { method: "GET" });
            return response.data;
        },
        queryKey: [`user-session-token-${currentUserId}`],
        retry: 3,
        retryDelay: 1000,
    });

    useEffect(() => {
        if (!currentUserId || !receiverId) return;
        if (getSessionToken.isLoading || !getSessionToken.data) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("authentication failed");
            return;
        }

        const apiUrl = import.meta.env.VITE_BASE_API_URL;
        userChatWebSocket.enableReconnect();
        userChatWebSocket.connect(token, receiverId, apiUrl);

        const handleConnected = (payload: any) => {
            setMessage(payload.message);
        };

        const handleMessage = (payload: any) => {
            if (payload.type === "error") {
                setMessage(payload.message);
                return;
            }
            const queryKey = [`user-chat-${receiverId}`];
            
            if (payload.type === "user-message:sent") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;
                    const newMessagePage = [...old.pages];
                    newMessagePage[0] = [payload.data, ...newMessagePage[0]];
                    return { ...old, pages: newMessagePage }
                });
            } else if (payload.type === "user-message:deleted") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;
                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message: any) => {
                            if (payload.data.includes(message._id)) {
                                return { 
                                    ...message, 
                                    files_total: 0,
                                    text: "This message has been deleted", 
                                }
                            }
                            return message;
                        });
                    });
                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "user-message:changed") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return old;
                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            return message._id === payload.data._id ? payload.data : message
                        });
                    });
                    return { ...old, pages: newMessagePage };
                });
            }
        }

        const handleReconnecting = (payload: any) => {
            setMessage(payload.message);
        }

        const handleMaxRetries = (payload: any) => {
            setMessage(payload.message);
            userChatWebSocket.disconnect();
        }

        const handleDisconnected = () => {
            //
        }

        const handleError = (payload: any) => {
            const msg = payload.message;
            setMessage(msg);

            if (msg.includes("not allowed") || msg.includes("Invalid user")) {
                userChatWebSocket.disconnect();
            }
        }

        userChatWebSocket.on("connected", handleConnected);
        userChatWebSocket.on("message", handleMessage);
        userChatWebSocket.on("disconnected", handleDisconnected);
        userChatWebSocket.on("error", handleError);
        userChatWebSocket.on("reconnecting", handleReconnecting);
        userChatWebSocket.on("max_retries", handleMaxRetries);

        return () => {
            userChatWebSocket.off("connected", handleConnected);
            userChatWebSocket.off("message", handleMessage);
            userChatWebSocket.off("disconnected", handleDisconnected);
            userChatWebSocket.off("error", handleError);
            userChatWebSocket.off("reconnecting", handleReconnecting);
            userChatWebSocket.off("max_retries", handleMaxRetries);
        }
    }, [
        currentUserId, 
        getSessionToken.data, 
        getSessionToken.isLoading, 
        getSessionToken.error, 
        queryClient, 
        receiverId, 
        setMessage
    ]);

    const changeMessageMt = useMutation({
        mutationFn: async (id: string) => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats`;
            const newMessage = JSON.stringify({ _id: id, text: text.trim(), receiver_id: receiverId });
            return await apiRequest<IUserChat>(endpoint, { body: newMessage, method: "PUT" });
        },
        onError: (error) => {
            setMessage(error.message || "Failed to edit message");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chats-${receiverId}`] });
            setText("");
            setSelectMode(false);
            setChosenMessage(null);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
            resetChosenMessageIds();
        }
    });

    const clearAllMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/clear`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });
    
    const clearChosenMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/clear/bulk`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });

    const deleteAllMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });

    const deleteChosenMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/bulk`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });

    const handleMediaPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const tempt: IFilePreview[] = [];
        
        if (!files || files.length === 0) return;

        for (let p = 0; p < files.length; p++) {
            tempt.push({
                file: files[p],
                file_name: files[p].name,
                file_type: files[0].type,
                url: URL.createObjectURL(files[p])
            });
        }
        
        setChosenFiles(prev => [...prev, ...tempt]);
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }

    const sendMessageMt = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("receiver_id", receiverId!);
            
            if (text.trim()) formData.append("text", text.trim());
            
            if (chosenFiles && chosenFiles.length > 0) {
                for (let m = 0; m < chosenFiles.length; m++) {
                    formData.append("files", chosenFiles[m].file);
                }
            }
    
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats`;
            await apiUpload(endpoint, formData, "POST");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });

    const showAllUserChats = useInfiniteQuery({
        enabled: !!receiverId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 52) return;
            return allPages.length + 1;
        },
        initialPageParam: 1,
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats?receiver_id=${receiverId}&page=${pageParam}&limit=${52}`;
            const request = await apiRequest<IUserChat[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        queryKey: [`user-chat-${receiverId}`]
    });

    const showChosenMessageFiles = useQuery({
        enabled: !!chosenMessageId && chosenMessageId !== "",
        queryFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/files/${chosenMessageId}`;
            const request = await apiRequest<IUserChatFiles>(endpoint, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                method: "GET"
            });
            return request;
        },
        queryKey: [`user-chat-media-${chosenMessageId}`],
        staleTime: Infinity
    });

    const isProcessing = [
        changeMessageMt,
        clearAllMessagesMt,
        clearChosenMessagesMt,
        deleteAllMessagesMt,
        deleteChosenMessagesMt,
        sendMessageMt
    ].some((feature) => feature.isPending);

    return { 
        showAllUserChats, 
        clearChosenMessagesMt,
        clearAllMessagesMt,
        deleteAllMessagesMt,
        deleteChosenMessagesMt,
        changeMessageMt,
        handleMediaPreview, 
        inputMediaRef, 
        isProcessing, 
        sendMessageMt, 
        showChosenMessageFiles
    }
}