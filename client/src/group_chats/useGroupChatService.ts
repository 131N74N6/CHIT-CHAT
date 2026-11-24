import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGroupChatStore } from "./useGroupChatStore";
import { useRef } from "react";
import type { IGroupMessage, IGroupMessageFiles, IGroupFilePreview } from "./model";
import { useMessageStore } from "../alert/useMessageStore";
import { apiRequest, apiUpload } from "../api";
import useGroupChatWebSocket from "./useGroupChatWebSocket";

export default function useGroupChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);
    
    const groupId = useGroupChatStore((state) => state.groupId);
    const groupMessageId = useGroupChatStore((state) => state.groupMessageId);
    
    const setMessage = useMessageStore((state) => state.setMessage);

    const chosenFiles = useGroupChatStore((state) => state.chosenFiles);
    const setChosenFiles = useGroupChatStore((state) => state.setChosenFiles);

    const groupMessage = useGroupChatStore((state) => state.groupMessage);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);
    const setSelectMode = useGroupChatStore((state) => state.setSelectMode);

    const resetChosenMessageIdsFromGroup = useGroupChatStore((state) => state.resetChosenMessageIdsFromGroup);
    const setOpenPopUpOption = useGroupChatStore((state) => state.setOpenPopUpOption);

    useGroupChatWebSocket();

    const changeChosenMessageMt = useMutation({
        mutationFn: async (id: string) => {
            const endpoint = `/api/v1/groups/chats`;
            const data = JSON.stringify({ _id: id.trim(), text: groupMessage.trim(), group_id: groupId });
            await apiRequest(endpoint, { body: data, method: "PUT" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            resetChosenMessageIdsFromGroup();
            setChosenMessageFromGroup(null);
            setGroupMessage("");
            setChosenFiles([]);
            setSelectMode(false);
        }
    });

    const clearAllMessageFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/chats/clear?group_id=${groupId}`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            resetChosenMessageIdsFromGroup();
            setGroupMessage("");
            setChosenFiles([]);
            setSelectMode(false);
            setChosenMessageFromGroup(null);
            setOpenPopUpOption(false);
        }
    });

    const clearChosenMessageFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/chats/clear/bulk`;
            const data = JSON.stringify({ group_id: groupId, message_ids: chosenMessageIdsFromGroup });
            await apiRequest(endpoint, {body: data, method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
            resetChosenMessageIdsFromGroup();
            setChosenMessageFromGroup(null);
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const deleteAllMessagesFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/chats?group_id=${groupId}`;
            await apiRequest(endpoint, {  method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
            resetChosenMessageIdsFromGroup();
            setChosenMessageFromGroup(null);
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const deleteChosenMessagesFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/chats/bulk`;
            const data = JSON.stringify({ group_id: groupId, message_ids: chosenMessageIdsFromGroup });
            await apiRequest(endpoint, {body: data, method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
            resetChosenMessageIdsFromGroup();
            setChosenMessageFromGroup(null);
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const handleMediaPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        const temp: IGroupFilePreview[] = [];

        if (!files || files.length === 0) return;

        for (let x = 0; x < files.length; x++) {
            temp.push({
                file: files[x],
                file_name: files[x].name,
                file_type: files[x].type,
                url: URL.createObjectURL(files[x])
            });
        }

        setChosenFiles(prev => [...prev, ...temp]);
        
        if (inputMediaRef.current) inputMediaRef.current.value = "";
    }
    
    const sendChatToGroup = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/groups/chats`;
            const newMessage = new FormData();
            newMessage.append("group_id", groupId);

            if (groupMessage.trim()) newMessage.append("text", groupMessage.trim());

            if (chosenFiles && chosenFiles.length > 0) {
                for (let t = 0; t < chosenFiles.length; t++) {
                    newMessage.append("files", chosenFiles[t].file);
                }
            }

            await apiUpload(endpoint, newMessage, "POST");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            setGroupMessage("");
            setChosenFiles([]);
            resetChosenMessageIdsFromGroup();
            setChosenMessageFromGroup(null);
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const showFilesThatSentToGroup = useQuery({
        enabled: !!groupMessageId && !!groupId && groupMessageId !== "",
        queryFn: async () => {
            const endpoint = `/api/v1/groups/chats/files?_id=${groupMessageId}`;
            const request = await apiRequest<IGroupMessageFiles>(endpoint, { method: "GET" });
            return request.data;
        },
        queryKey: [`group-chat-files-${groupMessageId}`]
    });

    const showAllGroupMessages = useInfiniteQuery({
        enabled: !!groupId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 52) return;
            return allPages.length + 1;
        },
        initialPageParam: 1,
        queryFn: async ({pageParam = 1}: { pageParam?: number }) => {
            const endpoint = `/api/v1/groups/chats?group_id=${groupId}&page=${pageParam}&limit=${52}`;
            const request = await apiRequest<IGroupMessage[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        queryKey: [`group-chat-${groupId}`]
    });

    const isProcessing = [changeChosenMessageMt, clearAllMessageFromGroupMt, clearChosenMessageFromGroupMt,
    deleteAllMessagesFromGroupMt, deleteChosenMessagesFromGroupMt, 
    sendChatToGroup].some((feature) => feature.isPending);

    return { 
        clearAllMessageFromGroupMt, 
        clearChosenMessageFromGroupMt, 
        deleteAllMessagesFromGroupMt,
        deleteChosenMessagesFromGroupMt,
        changeChosenMessageMt,
        handleMediaPreview,
        inputMediaRef,
        isProcessing,
        showFilesThatSentToGroup,
        sendChatToGroup,
        showAllGroupMessages
    }
}