import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IUserService, UserProfileIntrf } from "../models/user.model";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user.store";
import { useRef } from "react";
import { useRoomStore } from "../stores/room.store";

export default function UserServices(props?: IUserService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/users`;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const roomProfileRef = useRef<HTMLInputElement>(null);

    const description = useRoomStore((state) => state.description);
    const setDescription = useRoomStore((state) => state.setDescription);

    const roomName = useRoomStore((state) => state.roomName);
    const setRoomName = useRoomStore((state) => state.setRoomName);

    const oldRoomPicture = useRoomStore((state) => state.oldRoomPicture);
    const setOldRoomPicture = useRoomStore((state) => state.setOldRoomPicture);

    const selectedProfileRoom = useRoomStore((state) => state.selectedProfileRoom);
    const setSelectedProfileRoom = useRoomStore((state) => state.setSelectedProfileRoom);

    const selectedProfileRoomUrl = useRoomStore((state) => state.selectedProfileRoomUrl);
    const setSelectedProfileRoomUrl = useRoomStore((state) => state.setSelectedProfileRoomUrl);

    const resetRoomState = useRoomStore((state) => state.resetRoomState);

    const address = useUserStore((state) => state.address);
    const setAddress = useUserStore((state) => state.setAddress);

    const gender = useUserStore((state) => state.gender);
    const setGender = useUserStore((state) => state.setGender);

    const oldProfile = useUserStore((state) => state.oldProfile);
    const setOldProfilePicture = useUserStore((state) => state.setOldProfilePicture);

    const profilePicture = useUserStore((state) => state.profilePicture);
    const setProfilePicture = useUserStore((state) => state.setProfilePicture);

    const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);

    const { data: user, error: userError, isLoading: isUserLoading } = useQuery<UserProfileIntrf>({
        retry: false,
        queryFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/show`, {
                    credentials: "include",
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
        staleTime: Infinity,
    });

    const currentUser = { isUserLoading, user, userError }

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
                const request = await fetch(`${baseUrl}/show-all?page=${pageParam}&limit=${14}`, {
                    credentials: "include",
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

    const allUsers = { 
        fetchNextUser, 
        usersHaveNextPage, 
        isFetchNextUser, 
        isUsersLoading, 
        users: users ? users.pages.flat() : [], 
        usersError 
    }

    const changeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName);
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                if (oldRoomPicture && oldRoomPicture.public_id) {
                    const request = await fetch(`${baseUrl}/remake-room/${props?.roomId}`, {
                        body: JSON.stringify({ old_image: oldRoomPicture }),
                        credentials: "include",
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${baseUrl}/remake-room/${props?.roomId}`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-profile-${props?.roomId}`) ||
                        queryKey[0].startsWith(`available-room-${user?.user_id}`);
                    }
                    return false;
                }
            });
            resetRoomState();
        }
    });

    const changeUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("address", address.trim());
                formData.append("gender", gender);
                formData.append("username", username.trim());
                if (profilePicture) formData.append("image", profilePicture);

                if (oldProfile && oldProfile.public_id) {
                    const request = await fetch(`${baseUrl}/rm-pict`, {
                        body: JSON.stringify({ old_image: oldProfile }),
                        credentials: "include",
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${baseUrl}/remake`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`all-users`) ||
                        queryKey[0].startsWith('current-user') ||
                        queryKey[0].startsWith(`room-profile-${props?.roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const deleteRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-room/${props?.roomId}`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`room-member-${props?.roomId}`) ||
                        queryKey[0].startsWith(`available-room-${user?.user_id}`) ||
                        queryKey[0].startsWith(`room-profile-${props?.roomId}`);
                    }
                    return false;
                }
            });
            resetRoomState();
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm`, {
                    credentials: "include",
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

    const handleImageRoomPreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setSelectedProfileRoom(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setSelectedProfileRoomUrl(previewUrl);
        if (roomProfileRef.current) roomProfileRef.current.value = "";
    }

    const joinRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/join-room`, {
                    body: JSON.stringify({ room_code: roomCode.trim() }),
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
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
        }
    });

    const kickMemberMt = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const request = await fetch(`${baseUrl}/kick/${userId}`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`room-member-${props?.roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const leftRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/left-room/${props?.roomId}`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`current-user`) ||
                        queryKey[0].startsWith(`room-profile-${props?.roomId}`);
                    }
                    return false;
                }
            });
        }
    });

    const makeRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("description", description.trim());
                formData.append("name", roomName.trim());
                if (selectedProfileRoom) formData.append("image", selectedProfileRoom);

                const request = await fetch(`${baseUrl}/make-room`, {
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
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`available-room-${user?.user_id}`) ||
                        queryKey[0].startsWith(`room-profile-${props?.roomId}`);
                    }
                    return false;
                }
            });
            resetRoomState();
        }
    });

    const resetImagePreview = () => {
        setOldProfilePicture(null);
        setProfilePicture(null);
        setProfilePictureUrl(null);
    }

    const isUserProcessing = currentUser.isUserLoading || allUsers.isUsersLoading || changeRoomMt.isPending ||
    changeUserMt.isPending || deleteRoomMt.isPending || deleteUserMt.isPending || kickMemberMt.isPending ||
    leftRoomMt.isPending || makeRoomMt.isPending;

    return {
        allUsers,
        changeRoomMt,
        changeUserMt,
        currentUser,
        deleteRoomMt,
        deleteUserMt,
        handleImagePreview,
        handleImageRoomPreview,
        isUserProcessing,
        joinRoomMt,
        kickMemberMt,
        leftRoomMt,
        makeRoomMt,
        oldProfile,
        profilePicture,
        profilePictureUrl,
        resetImagePreview,
        roomCode,
        selectedProfileRoom,
        selectedProfileRoomUrl,
        setAddress,
        setDescription,
        setGender,
        setOldProfilePicture,
        setOldRoomPicture,
        setProfilePictureUrl,
        setProfilePicture,
        setRoomCode,
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl,
        setUserName
    }
}