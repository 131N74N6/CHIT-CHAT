import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserChatStore } from "../user_chats/store";
import { useUserStore } from "./store";
import { useNavbarStore } from "../navbar/store";
import { useCallback, useEffect, useRef } from "react";
import { useMessageStore } from "../alert/store";
import { apiRequest, apiUpload } from "../api";
import type { UserDetail, Users } from "./model";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "../group_profiles/store";
import { useChatbotStore } from "../chatbot/store";
import useUserSSEClient from "./sse";

export default function useUserProfileService() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const resetGroupMessageState = useGroupChatStore((state) => state.resetGroupMessageState);
    
    const resetGroupMemberState = useGroupMemberStore((state) => state.resetGroupMemberState);
    
    const resetGroupProfileState = useGroupProfileStore((state) => state.resetGroupProfileState);

    const address = useUserStore((state) => state.address);
    const setAddress = useUserStore((state) => state.setAddress);

    const currentUserId = useUserStore((state) => state.currentUserId);
    const groupIds = useUserStore((state) => state.groupIds);
    
    const description = useUserStore((state) => state.description);
    const setDescription = useUserStore((state) => state.setDescription);

    const setEditMode = useUserStore((state) => state.setEditMode);

    const gender = useUserStore((state) => state.gender);
    const setGender = useUserStore((state) => state.setGender);

    const profilePicture = useUserStore((state) => state.profilePicture);
    const setProfilePicture = useUserStore((state) => state.setProfilePicture);

    const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);

    const resetUserState = useUserStore((state) => state.resetUserState);

    const resetChatState = useUserChatStore((state) => state.resetChatState);
    
    const resetChatBotState = useChatbotStore((state) => state.resetChatBotState);

    const receiverId = useUserChatStore((state) => state.receiverId);

    const resetNavbarState = useNavbarStore((state) => state.resetNavbarState);
    const receiverIdRef = useRef(receiverId);

    useEffect(() => {
        receiverIdRef.current = receiverId;
    }, [receiverId]);

    const mergeCurrentUser = useCallback((old: any, incoming: any) => {
        if (!old && !incoming) return old;
        if (!old) return incoming;

        return {
            ...old,
            ...incoming,
            profile_picture: {
                ...(old.profile_picture ?? {}),
                ...(incoming.profile_picture ?? {}),
            },
        }
    }, []);

    const patchAllUsers = useCallback((userId: string, patch: Record<string, any>) => {
        queryClient.setQueryData(["all-users"], (old: any) => {
            if (!old?.pages) return old;

            return { ...old, pages: old.pages.map((page: any[]) => {
                return page.map((user) => {
                    return user._id === userId ? { ...user, ...patch } : user });
                }),
            }
        });
    }, [queryClient]);

    const removeAllUsers = useCallback((userId: string) => {
        queryClient.setQueryData(["all-users"], (old: any) => {
            if (!old?.pages) return old;

            return {
                ...old, pages: old.pages.map((page: any[]) => {
                    return page.filter((user) => user._id !== userId)
                }),
            }
        });
    }, [queryClient]);

    useUserSSEClient(mergeCurrentUser, patchAllUsers, receiverIdRef, removeAllUsers);

    const changeUserMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/users`;
            const newUserInfo = new FormData();
            newUserInfo.append("address", address.trim());
            newUserInfo.append("description", description.trim());
            newUserInfo.append("gender", gender.trim());
            newUserInfo.append("name", username.trim());

            if (profilePicture) newUserInfo.append("image", profilePicture);

            await apiUpload(endpoint, newUserInfo, "PUT");
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            if (fileInputRef.current) fileInputRef.current.value = "";
            
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            
            queryClient.setQueryData(["current-user"], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    user_name: username,
                    address: address,
                    gender: gender,
                    description: description,
                    profile_picture: profilePictureUrl 
                        ? { url: profilePictureUrl, public_id: old.profile_picture?.public_id || "pending" }
                        : old.profile_picture,
                };
            });

            if (groupIds.length > 0) {
                groupIds.map((group_id) => {
                    queryClient.invalidateQueries({ queryKey: [`group-chat-${group_id}`] });
                    queryClient.invalidateQueries({ queryKey: [`group-member-${group_id}`] });
                });
            }
            
            setUserName("-");
            setAddress("-");
            setDescription("-");
            setGender("-");
            setEditMode(false);
            setProfilePicture(null);
            setProfilePictureUrl(null); 
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/users`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            if (fileInputRef.current) fileInputRef.current.value = "";
            queryClient.setQueryData(["current-user"], null);
            queryClient.clear();
            resetChatState();
            resetGroupMemberState();
            resetGroupMessageState();
            resetGroupProfileState();
            resetUserState();
            resetChatBotState();
            resetNavbarState();
            useGroupChatStore.persist.clearStorage();
            useUserStore.persist.clearStorage();
            useUserChatStore.persist.clearStorage();
            navigate("/sign-in");
        }
    });

    const deleteUserProfilePictureMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/users/profile-picture`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            if (fileInputRef.current) fileInputRef.current.value = "";
            
            queryClient.invalidateQueries({ queryKey: ["all-users"], type: "active" });
            queryClient.invalidateQueries({ queryKey: ["current-user"], type: "active" });

            if (groupIds.length > 0) {
                groupIds.map((group_id) => {
                    queryClient.invalidateQueries({ queryKey: [`group-chat-${group_id}`] });
                    queryClient.invalidateQueries({ queryKey: [`group-member-${group_id}`] });
                });
            }
        }
    });

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setProfilePicture(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setProfilePictureUrl(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
    
    const showUsers = useInfiniteQuery({
        enabled: !!currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({pageParam = 1}: { pageParam?:number }) => {
            const endpoint = `/api/v1/users/all?page=${pageParam}&limit=${16}`;
            const request = await apiRequest<Users[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        initialPageParam: 1,
        queryKey: ["all-users"]
    });

    const showOtherUser = useQuery({
        enabled: !!receiverId && currentUserId !== receiverId,
        queryFn: async () => {
            const endpoint = `/api/v1/users?id=${receiverId}`;
            const request = await apiRequest<UserDetail>(endpoint, { method: "GET" });
            return request.data;
        },
        queryKey: [`other-user-${receiverId}`]
    });

    const isProcessing = [
        changeUserMt, deleteUserMt, deleteUserProfilePictureMt
    ].some((a => a.isPending));

    return {
        showUsers,
        changeUserMt,
        deleteUserMt,
        deleteUserProfilePictureMt,
        fileInputRef,
        handleImagePreview,
        isProcessing,
        showOtherUser,
    }
}