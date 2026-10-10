import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGroupChatStore } from "./store";
import { useEffect, useRef } from "react";
import type { IGroupMessage, IGroupMessageFiles, IGroupFilePreview } from "./model";
import { useMessageStore } from "../stores/message.store";
import { apiRequest, apiUpload } from "../api";
import { useUserStore } from "../user_profiles/store";
import { groupChatWebSocket } from "./event";

export default function useGroupChatService() {
    const queryClient = useQueryClient();
    const inputMediaRef = useRef<HTMLInputElement>(null);

    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);
    
    const groupId = useGroupChatStore((state) => state.groupId);
    const groupMessageId = useGroupChatStore((state) => state.groupMessageId);
    
    const setMessage = useMessageStore((state) => state.setMessage);

    const media = useGroupChatStore((state) => state.chosenFiles);
    const setChosenFiles = useGroupChatStore((state) => state.setChosenFiles);

    const groupMessage = useGroupChatStore((state) => state.groupMessage);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);
    const setSelectMode = useGroupChatStore((state) => state.setSelectMode);

    const resetChosenMessageIdsFromGroup = useGroupChatStore((state) => state.resetChosenMessageIdsFromGroup);
    const setOpenPopUpOption = useGroupChatStore((state) => state.setOpenPopUpOption);

    const currentUserId = useUserStore((state) => state.currentUserId);

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
        if (!groupId || !currentUserId) return;
        if (getSessionToken.isLoading && !getSessionToken.data) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("authentication failed");
            return;
        }

        const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
        groupChatWebSocket.enableReconnect();
        groupChatWebSocket.connect(baseApiUrl, groupId, token);

        const handleConnectionToGroup = (payload: any) => {
            setMessage(payload.message);
        }

        const handleGroupMessage = (payload: any) => {
            if (payload.type === "error") {
                setMessage(payload.message);
                return;
            }

            const queryKey = [`group-chat-${groupId}`];

            if (payload.type === "group-message:changed") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return old;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            return message._id === payload.data._id ? payload.data : message
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "group-message:deleted") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            if (payload.data.includes(message._id)) {
                                return {
                                    ...message, 
                                    files: [], 
                                    files_total: 0, 
                                    text: "This message has been deleted"
                                }
                            }
                            return message;
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "group-message:sent") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;
                    const newMessagePage = [...old.pages];
                    newMessagePage[0] = [payload.data, ...newMessagePage[0]];
                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "group-message-owner:changed") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return old;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            return message._id === payload.data._id ? payload.data : message
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.message === "group-message-owner:deleted") {
                queryClient.setQueryData(queryKey, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.filter((message) => {
                            return message.sender_id !== payload.data
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            }
        }

        const handleError = (payload: any) => {
            const message = payload.message;
            setMessage(message);

            if (message.includes("not allowed") || message.includes("Invalid user")) {
                groupChatWebSocket.disconnect();
            }
        }

        const handleDisconnect = () => {
            //
        }

        const handleReconnecting = (payload: any) => {
            setMessage(payload.message);
        }

        const handleMaxRetries = (payload: any) => {
            setMessage(payload.message);
            groupChatWebSocket.disconnect();
        }

        groupChatWebSocket.on("connect", handleConnectionToGroup);
        groupChatWebSocket.on("disconnected", handleDisconnect);
        groupChatWebSocket.on("error", handleError);
        groupChatWebSocket.on("max_retries", handleMaxRetries);
        groupChatWebSocket.on("message", handleGroupMessage);
        groupChatWebSocket.on("reconnecting", handleReconnecting);

        return () => {
            groupChatWebSocket.off("connect", handleConnectionToGroup);
            groupChatWebSocket.off("disconnected", handleDisconnect);
            groupChatWebSocket.off("error", handleError);
            groupChatWebSocket.off("max_retries", handleMaxRetries);
            groupChatWebSocket.off("message", handleGroupMessage);
            groupChatWebSocket.off("reconnecting", handleReconnecting);
        }
    }, [
        currentUserId, 
        getSessionToken.data, 
        getSessionToken.error, 
        getSessionToken.error, 
        groupId, 
        queryClient, 
        setMessage
    ]);

    const changeChosenMessageMt = useMutation({
        mutationFn: async (id: string) => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats`;
            await apiRequest(endpoint, {
                body: JSON.stringify({ 
                    _id: id.trim(), 
                    text: groupMessage.trim(), 
                    group_id: groupId 
                }),
                method: "PUT"
            });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
            setSelectMode(false);
        }
    });

    const clearAllMessageFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats/clear?group_id=${groupId}`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
            setSelectMode(false);
            setOpenPopUpOption(false);
        }
    });

    const clearChosenMessageFromGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats/clear/bulk`;
            await apiRequest(endpoint, {
                body: JSON.stringify({ group_id: groupId, message_ids: chosenMessageIdsFromGroup }),
                method: "DELETE"
            });
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
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats?group_id=${groupId}`;
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
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats/bulk`;
            await apiRequest(endpoint, {
                body: JSON.stringify({ group_id: groupId, message_ids: chosenMessageIdsFromGroup }),
                method: "DELETE"
            });
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
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats`;
            const newMessage = new FormData();
            newMessage.append("group_id", groupId);

            if (groupMessage.trim()) newMessage.append("text", groupMessage.trim());

            if (media && media.length > 0) {
                for (let t = 0; t < media.length; t++) {
                    newMessage.append("files", media[t].file);
                }
            }

            await apiUpload(endpoint, newMessage, "POST");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`group-chat-${groupId}`] });
            setGroupMessage("");
            setChosenFiles([]);
        }
    });

    const showFilesThatSentToGroup = useQuery({
        enabled: !!groupMessageId && !!groupId && groupMessageId !== "",
        queryFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats/files?_id=${groupMessageId}`;
            const request = await apiRequest<IGroupMessageFiles>(endpoint, { method: "GET" });
            return request.data;
        },
        queryKey: [`group-chat-files-${groupMessageId}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const showAllGroupMessages = useInfiniteQuery({
        enabled: !!groupId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 52) return;
            return allPages.length + 1;
        },
        queryFn: async ({pageParam = 1}: { pageParam?: number }) => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/chats?
            group_id=${groupId}?page=${pageParam}&limit=${52}`;

            const request = await apiRequest<IGroupMessage[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        initialPageParam: 1,
        queryKey: [`group-chat-${groupId}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
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