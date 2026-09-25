import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useChatStore } from "./store";
import { useMessageStore } from "../stores/message.store";
import { apiRequest, apiUpload } from "../api";
import type { IFilePreview, IUserChat, IUserChatFiles } from "./model";

export default function useUserChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const setSelectMode = useChatStore((state) => state.setSelectMode);

    const chosenMessageId = useChatStore((state) => state.chosenMessageId);

    const receiverId = useChatStore((state) => state.receiverId);
    const setMessage = useMessageStore((state) => state.setMessage);

    const chosenFiles = useChatStore((state) => state.chosenFiles);
    const setChosenFiles = useChatStore((state) => state.setChosenFiles);

    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);

    const resetChosenMessageIds = useChatStore((state) => state.resetChosenMessageIds);

    const setChosenMessage = useChatStore((state) => state.setChosenMessage);
    const setOpenPopUpOption = useChatStore((state) => state.setOpenPopUpOption);

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;
        if (getSessionToken.isLoading || !getSessionToken.data) return;
    }, [queryClient]);

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

    const clearAllUserChatsForMeMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/clear`;
            return await apiRequest(endpoint, { method: "DELETE" });
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
    
    const clearChosenUserChatForMeMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/clear/bulk`;
            return await apiRequest(endpoint, { method: "DELETE" });
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

    const deleteAllUserChatsMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats`;
            return await apiRequest(endpoint, { method: "DELETE" });
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

    const deleteChosenUsersChatMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/user-chats/bulk`;
            return await apiRequest(endpoint, { method: "DELETE" });
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
            const request = await apiUpload(endpoint, formData, "POST");
            return request.data;
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
        clearAllUserChatsForMeMt,
        clearChosenUserChatForMeMt,
        deleteAllUserChatsMt,
        deleteChosenUsersChatMt,
        sendMessageMt
    ].some((feature) => feature.isPending);

    return { 
        showAllUserChats, 
        clearChosenUserChatForMeMt,
        clearAllUserChatsForMeMt,
        deleteAllUserChatsMt,
        deleteChosenUsersChatMt,
        changeMessageMt,
        handleMediaPreview, 
        inputMediaRef, 
        isProcessing, 
        sendMessageMt, 
        showChosenMessageFiles
    }
}