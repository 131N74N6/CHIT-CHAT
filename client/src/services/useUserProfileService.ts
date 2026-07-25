import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IOtherUser, IUserProfileService, IUserProfile } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../stores/room.store";
import { useChatStore } from "../stores/chat.store";
import { useUserStore } from "../stores/user.store";
import { useNavbarStore } from "../stores/navbar.store";
import { useEffect, useRef } from "react";

export default function useUserProfileService(props?: IUserProfileService) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const address = useUserStore((state) => state.address);
    const setAddress = useUserStore((state) => state.setAddress);

    const setCurrentUserId = useUserStore((state) => state.setCurrentUserId);

    const editMode = useUserStore((state) => state.editMode);
    const setEditMode = useUserStore((state) => state.setEditMode);
    
    const deleteProfilePicture = useUserStore((state) => state.deleteProfilePicture);
    const setDeleteProfilePicture = useUserStore((state) => state.setDeleteProfilePicture);

    const gender = useUserStore((state) => state.gender);
    const setGender = useUserStore((state) => state.setGender);

    const oldProfile = useUserStore((state) => state.oldProfile);
    const setOldProfilePicture = useUserStore((state) => state.setOldProfilePicture);

    const profilePicture = useUserStore((state) => state.profilePicture);
    const setProfilePicture = useUserStore((state) => state.setProfilePicture);

    const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);

    const resetUserState = useUserStore((state) => state.resetUserState);

    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);
    
    const resetRoomState = useRoomStore((state) => state.resetRoomState);

    const resetChatState = useChatStore((state) => state.resetChatState);
    const receiverId = useChatStore((state) => state.receiverId);

    const resetNavbarState = useNavbarStore((state) => state.resetNavbarState);

    const { data: user, error: userError, isLoading: isUserLoading } = useQuery<IUserProfile>({
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/show`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: ['current-user'],
        retry: false,
        staleTime: Infinity,
    });

    const currentUser = { isUserLoading, user, userError }

    useEffect(() => {
        if (currentUser.user && currentUser.user.user_id && !isUserLoading) setCurrentUserId(currentUser.user.user_id);
    }, [currentUser.user, setCurrentUserId]);

    const { 
        data: users, 
        error: usersError, 
        fetchNextPage: fetchNextUser, 
        hasNextPage: usersHaveNextPage,
        isFetchingNextPage: isFetchNextUser,
        isLoading: isUsersLoading 
    } = useInfiniteQuery({
        enabled: !!currentUser.user?.user_id,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryFn: async ({pageParam = 1}: { pageParam?:number }) => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/show-all?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        initialPageParam: 1,
        queryKey: [`all-users`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const paginatedUser: IOtherUser[] = users ? users.pages.flat() : [];

    const allUsers = { 
        fetchNextUser, 
        usersHaveNextPage, 
        isFetchNextUser, 
        isUsersLoading, 
        users: paginatedUser, 
        usersError 
    }

    const { data: detail, error: detailError, isLoading: isDetailLoading } = useQuery<IOtherUser>({
        enabled: !!receiverId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/other/${receiverId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "GET"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: [`receiver-${receiverId}`],
        staleTime: Infinity
    });

    const receiverUserProfile = { detail, detailError, isDetailLoading }

    const changeUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("address", address.trim());
                formData.append("gender", gender);
                formData.append("username", username.trim());
                if (profilePicture) formData.append("image", profilePicture);

                if (deleteProfilePicture && deleteProfilePicture.public_id) {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/rm-pict`, {
                        body: JSON.stringify({ old_image: deleteProfilePicture }),
                        credentials: "include",
                        headers: { 'Content-Type': 'application/json' },
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/remake`, {
                    body: formData,
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
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });

            if (receiverId) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${receiverId}`] });
            }

            if (currentUser.user && currentUser.user.user_id) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${currentUser.user.user_id}`] });
            }

            if (currentUser.user && currentUser.user.room_id && currentUser.user.room_id.length > 0) {
                currentUser.user.room_id.forEach((room_id) => {
                    queryClient.invalidateQueries({ queryKey: [`room-chat-${room_id}`] });
                    queryClient.invalidateQueries({ queryKey: [`room-member-${room_id}`] });
                });
            }

            setEditMode(false);
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/rm`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "DELETE"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            resetChatState();
            resetRoomState();
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

    const joinRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/profiles/join-room`, {
                    body: JSON.stringify({ room_code: roomCode.trim() }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
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
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUser.user?.user_id}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomCode}`] });
            setRoomCode("");
        }
    });

    const isUserProfileProcessing = changeUserMt.isPending || currentUser.isUserLoading || allUsers.isUsersLoading ||
    deleteUserMt.isPending || joinRoomMt.isPending || receiverUserProfile.isDetailLoading;

    return {
        address,
        allUsers,
        changeUserMt,
        currentUser,
        deleteProfilePicture,
        deleteUserMt,
        editMode,
        fileInputRef,
        gender,
        handleImagePreview,
        isUserProfileProcessing,
        oldProfile,
        profilePicture,
        profilePictureUrl,
        setAddress,
        setDeleteProfilePicture,
        setEditMode,
        setGender,
        setOldProfilePicture,
        setProfilePictureUrl,
        setProfilePicture,
        joinRoomMt,
        receiverUserProfile,
        roomCode,
        setRoomCode,
        setUserName,
        username
    }
}