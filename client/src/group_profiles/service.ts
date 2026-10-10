import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMessageStore } from "../stores/message.store";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../user_profiles/store";
import { useGroupProfileStore } from "./store";
import { useEffect, useRef } from "react";
import { useGroupChatStore } from "../group_chats/store";
import { apiRequest, apiUpload } from "../api";
import type { IGroupProfileDetail, IGroups } from "./model";
import { groupProfileWebSocket } from "./event";

export default function useGroupProfileService() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUserId = useUserStore((state) => state.currentUserId);
    const groupId = useGroupChatStore((state) => state.groupId);
    
    const setEditMode = useGroupProfileStore((state) => state.setEditMode);

    const groupDescription = useGroupProfileStore((state) => state.groupDescription);
    const setGroupDescription = useGroupProfileStore((state) => state.setGroupDescription);

    const groupName = useGroupProfileStore((state) => state.groupName);
    const setGroupName = useGroupProfileStore((state) => state.setGroupName);

    const selectedProfileGroup = useGroupProfileStore((state) => state.selectedProfileGroup);
    const setSelectedProfileGroup = useGroupProfileStore((state) => state.setSelectedProfileGroup);

    const setSelectedProfileGroupUrl = useGroupProfileStore((state) => state.setSelectedProfileGroupUrl);

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
        if (!currentUserId && !groupId) return;
        if (getSessionToken.isLoading && !getSessionToken.data) return;

        const token = getSessionToken.data;

        if (!token || typeof token !== "string") {
            setMessage("authentication failed");
            return;
        }

        const baseApiUrl = import.meta.env.VITE_BASE_API_URL;
        groupProfileWebSocket.enableReconnect();
        groupProfileWebSocket.connect(baseApiUrl, groupId, token);

        const queryKey1 = [`available-group-${currentUserId}`];
        const queryKey2 = [`group-profile-${groupId}`];

        const handleConnected = (payload: any) => {
            setMessage(payload.message);
        };

        const handleMessage = (payload: any) => {
            if (payload.type === "joined-group:changed") {
                queryClient.setQueryData(queryKey1, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            return message._id === payload.data._id ? payload.data : message;
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "group-profile:changed") {
                queryClient.setQueryData(queryKey2, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.map((message) => {
                            return message._id === payload.data._id ? payload.data : message;
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "group-profile:deleted") {
                queryClient.setQueryData(queryKey1, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.filter((message) => {
                            return message._id !== payload.data
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
            } else if (payload.type === "joined-group:deleted") {
                queryClient.setQueryData(queryKey2, (old: any) => {
                    if (!old) return;

                    const newMessagePage = old.pages.map((page: any[]) => {
                        return page.filter((message) => {
                            return message._id !== payload.data
                        });
                    });

                    return { ...old, pages: newMessagePage };
                });
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
            groupProfileWebSocket.disconnect();
        }
        
        const handleError = (payload: any) => {
            const msg = payload.message;
            setMessage(msg);

            if (msg.includes("not allowed") || msg.includes("Invalid user")) {
                groupProfileWebSocket.disconnect();
            }
        }

        groupProfileWebSocket.on("connect", handleConnected);
        groupProfileWebSocket.on("message", handleMessage);
        groupProfileWebSocket.on("disconnected", handleDisconnect);
        groupProfileWebSocket.on("error", handleError);
        groupProfileWebSocket.on("reconnecting", handleReconnecting);
        groupProfileWebSocket.on("max_retried", handleMaxRetries);

        return () => {
            groupProfileWebSocket.off("connect", handleConnected);
            groupProfileWebSocket.off("disconnected", handleDisconnect);
            groupProfileWebSocket.off("message", handleMessage);
            groupProfileWebSocket.off("error", handleError);
            groupProfileWebSocket.off("reconnecting", handleReconnecting);
            groupProfileWebSocket.off("max_retried", handleMaxRetries);
        }
    }, [currentUserId, setMessage]);

    const changeGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups`;
            const newGroupProfileInfo = new FormData();
            newGroupProfileInfo.append("_id", groupId.trim());
            if (groupDescription) newGroupProfileInfo.append("group_description", groupDescription.trim());
            if (groupName) newGroupProfileInfo.append("group_name", groupName.trim());
            if (selectedProfileGroup) newGroupProfileInfo.append("group_profile", selectedProfileGroup);

            await apiUpload(endpoint, newGroupProfileInfo, "PUT");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`group-profile-${groupId}`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`);
                    }
                    return false;
                }
            });

            setSelectedProfileGroup(null);
            setSelectedProfileGroupUrl(null);
            setGroupDescription("");
            setGroupName("");
            setEditMode(false);
        }
    });
        
    const createGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups`;
            const formData = new FormData();
            formData.append("group_name", groupName.trim());
            if (groupDescription) formData.append("group_description", groupDescription.trim());
            if (selectedProfileGroup) formData.append("group_profile", selectedProfileGroup);

            await apiUpload(endpoint, formData, "POST");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`group-member-${groupId}`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`);
                    }
                    return false;
                }
            });

            setSelectedProfileGroup(null);
            setSelectedProfileGroupUrl(null);
            setGroupDescription("");
            setGroupName("");
            navigate(`/rooms`);
        }
    });

    const deleteGroupMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups?group_id=${groupId}`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`group-chat-${groupId}`) ||
                        queryKey[0].startsWith(`group-member-${groupId}`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`) ||
                        queryKey[0].startsWith(`group-profile-${groupId}`);
                    }
                    return false;
                }
            });
        }
    });

    const deleteGroupProfilePictureMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/${groupId}`;
            await apiRequest(endpoint, { method: "PUT" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`group-chat-${groupId}`) ||
                        queryKey[0].startsWith(`group-member-${groupId}`) ||
                        queryKey[0].startsWith(`available-group-${currentUserId}`) ||
                        queryKey[0].startsWith(`group-profile-${groupId}`);
                    }
                    return false;
                }
            });
        }
    });
    
    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedProfileGroup(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedProfileGroupUrl(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const showJoinedGroup = useInfiniteQuery({
        enabled: !!currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({ pageParam = 1 }: { pageParam?: number }) => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups?limit=${16}&page=${pageParam}`;
            const request = await apiRequest<IGroups[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        initialPageParam: 1,
        queryKey: [`available-group-${currentUserId}`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const showGroupDetail = useQuery({
        enabled: !!groupId,
        queryFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/groups/${groupId}`;
            const request = await apiRequest<IGroupProfileDetail>(endpoint, { method: "GET" });
            return request.data;
        },
        queryKey: [`group-profile-${groupId}`],
        staleTime: Infinity
    });

    const isProcessing = [
        changeGroupMt, deleteGroupMt, createGroupMt, deleteGroupProfilePictureMt
    ].some((feature) => feature.isPending);

    return { 
        showJoinedGroup,
        changeGroupMt,
        deleteGroupProfilePictureMt,
        showGroupDetail,
        deleteGroupMt,
        fileInputRef, 
        handleImagePreview,
        isProcessing, 
        createGroupMt, 
    }
}