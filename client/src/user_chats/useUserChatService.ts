import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useUserChatStore } from "./useUserChatStore";
import { useMessageStore } from "../alert/useMessageStore";
import { apiRequest, apiUpload } from "../api";
import type { IFilePreview, IUserChat, IUserChatFiles } from "./model";
import useUserChatWebSocket from "./useUserChatWebSocket";

export default function useUserChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const chosenMessageId = useUserChatStore((state) => state.chosenMessageId);
    const setSelectMode = useUserChatStore((state) => state.setSelectMode);

    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);
    const resetChosenMessageIds = useUserChatStore((state) => state.resetChosenMessageIds);

    const receiverId = useUserChatStore((state) => state.receiverId);
    const chosenFiles = useUserChatStore((state) => state.chosenFiles);
    const setChosenFiles = useUserChatStore((state) => state.setChosenFiles);

    const text = useUserChatStore((state) => state.text);
    const setText = useUserChatStore((state) => state.setText);

    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);
    const setOpenPopUpOption = useUserChatStore((state) => state.setOpenPopUpOption);

    const setMessage = useMessageStore((state) => state.setMessage);

    useUserChatWebSocket();

    const changeMessageMt = useMutation({
        mutationFn: async (id: string) => {
            const endpoint = `/api/v1/user-chats`;
            const newMessage = JSON.stringify({ _id: id, text: text.trim(), receiver_id: receiverId });
            await apiRequest<IUserChat>(endpoint, { body: newMessage, method: "PUT" });
        },
        onError: (error) => {
            setMessage(error.message || "Failed to edit message");
        },
        onSuccess: () => {
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
            const endpoint = `/api/v1/user-chats/clear?receiver_id=${receiverId}`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-messages-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            setSelectMode(false);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });
    
    const clearChosenMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/user-chats/clear/bulk`;
            const data = JSON.stringify({ message_ids: chosenMessageIds, receiver_id: receiverId });
            await apiRequest(endpoint, { body: data, method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-messages-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            setSelectMode(false);
            resetChosenMessageIds();
            setOpenPopUpOption(false);
        }
    });

    const deleteAllMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/user-chats?receiver_id=${receiverId}`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-messages-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const deleteChosenMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/user-chats/bulk`;
            const data = JSON.stringify({ message_ids: chosenMessageIds, receiver_id: receiverId });
            await apiRequest(endpoint, { body: data, method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`user-messages-${receiverId}`] });
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setSelectMode(false);
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
                file_type: files[p].type,
                url: URL.createObjectURL(files[p])
            });
        }
        
        setChosenFiles(prev => [...prev, ...tempt]);
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }

    const sendMessageMt = useMutation({
        mutationFn: async () => {
            const formData = new FormData();
            formData.append("receiver_id", receiverId.trim());
            
            if (text.trim()) formData.append("text", text.trim());
            
            if (chosenFiles && chosenFiles.length > 0) {
                for (let m = 0; m < chosenFiles.length; m++) {
                    formData.append("files", chosenFiles[m].file);
                }
            }
    
            const endpoint = `/api/v1/user-chats`;
            await apiUpload(endpoint, formData, "POST");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            if (inputMediaRef.current) inputMediaRef.current.value = "";
            setText("");
            setChosenFiles([]);
            resetChosenMessageIds();
            setSelectMode(false);
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
            const endpoint = `/api/v1/user-chats?receiver_id=${receiverId}&page=${pageParam}&limit=${52}`;
            const request = await apiRequest<IUserChat[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        queryKey: [`user-messages-${receiverId}`]
    });

    const showChosenMessageFiles = useQuery({
        enabled: !!chosenMessageId && chosenMessageId !== "",
        queryFn: async () => {
            const endpoint = `/api/v1/user-chats/files/${chosenMessageId}`;
            const request = await apiRequest<IUserChatFiles>(endpoint, {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                method: "GET"
            });
            return request.data;
        },
        queryKey: [`user-messages-media-${chosenMessageId}`]
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