import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useUserChatStore } from "../user_chats/store";
import { useUserStore } from "./store";
import { useNavbarStore } from "../navbar/navbar.store";
import { useRef } from "react";
import { useMessageStore } from "../stores/message.store";
import { apiRequest, apiUpload } from "../api";
import type { UserDetail, Users } from "./model";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "../group_profiles/store";
import { useChatbotStore } from "../chatbot/store";

export default function useUserProfileService() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const setMessage = useMessageStore((state) => state.setMessage);
    const allowedFiles = ["image/png", "image/jpeg", "image/avif", "image/webp"];
    
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

    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);

    const resetUserState = useUserStore((state) => state.resetUserState);

    const resetChatState = useUserChatStore((state) => state.resetChatState);
    
    const resetChatBotState = useChatbotStore((state) => state.resetChatBotState);

    const receiverId = useUserChatStore((state) => state.receiverId);

    const resetNavbarState = useNavbarStore((state) => state.resetNavbarState);

    const changeUserMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/users`;
            const newUserInfo = new FormData();
            newUserInfo.append("address", address.trim());
            newUserInfo.append("description", description.trim());
            newUserInfo.append("gender", gender.trim());
            newUserInfo.append("name", username.trim());

            if (profilePicture) {
                if (allowedFiles.includes(profilePicture.type) === false) {
                    setProfilePicture(null);
                    setProfilePictureUrl(null);
                    throw new Error("You cant upload this file");
                }
                newUserInfo.append("image", profilePicture);
            }

            const request = await apiUpload(endpoint, newUserInfo, "PUT");
            return request.data;
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });

            if (receiverId) {
                queryClient.invalidateQueries({ queryKey: [`other-user-${receiverId}`] });
            }

            queryClient.invalidateQueries({ queryKey: [`other-user-${currentUserId}`] });

            if (groupIds.length > 0) {
                groupIds.map((group_id) => {
                    queryClient.invalidateQueries({ queryKey: [`group-chat-${group_id}`] });
                    queryClient.invalidateQueries({ queryKey: [`group-member-${group_id}`] });
                });
            }

            setAddress("");
            setDescription("");
            setEditMode(false);
            setGender("");
            setProfilePicture(null);
            setProfilePictureUrl(null);
            setUserName("");
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/users`;
            const request = await apiRequest(endpoint, { method: "DELETE" });
            return request.data;
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            useGroupChatStore.persist.clearStorage();
            useUserStore.persist.clearStorage();
            useUserChatStore.persist.clearStorage();
            resetChatState();
            resetGroupMemberState();
            resetGroupMessageState();
            resetGroupProfileState();
            resetUserState();
            resetChatBotState();
            resetNavbarState();
            navigate("/sign-in");
        }
    });

    const deleteUserProfilePictureMt = useMutation({
        mutationFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/users/${currentUserId}`;
            const request = await apiRequest(endpoint, { method: "PUT" });
            return request.data;
        },
        onError: (error) => {
            setMessage(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            useGroupChatStore.persist.clearStorage();
            useUserStore.persist.clearStorage();
            useUserChatStore.persist.clearStorage();
            resetChatState();
            resetGroupMemberState();
            resetGroupMessageState();
            resetGroupProfileState();
            resetUserState();
            resetNavbarState();
            navigate("/sign-in");
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
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/users/all?
            id=${currentUserId}&page=${pageParam}&limit=${16}`;

            const request = await apiRequest<Users[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        initialPageParam: 1,
        queryKey: [`all-users`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
    });

    const showOtherUser = useQuery({
        enabled: !!receiverId && currentUserId !== receiverId,
        queryFn: async () => {
            const endpoint = `${import.meta.env.VITE_BASE_API_URL}/api/v1/users?id=${receiverId}`;
            const request = await apiRequest<UserDetail>(endpoint, { method: "GET" });
            return request.data;
        },
        queryKey: [`other-user-${receiverId}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity
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