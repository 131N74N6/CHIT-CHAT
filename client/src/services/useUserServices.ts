import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IOtherUser, IUserService, IUserProfile } from "../models/user.model";
import { useNavigate } from "react-router-dom";

export default function useUserServices(props?: IUserService) {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/users`;
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: user, error: userError, isLoading: isUserLoading } = useQuery<IUserProfile>({
        queryFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/show`, {
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

    const deleteRoomMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-room/${props?.roomId}`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
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
        }
    });

    const deleteUserMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm`, {
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
            navigate("/sign-in");
        }
    });

    const kickMemberMt = useMutation({
        mutationFn: async (userId: string) => {
            try {
                const request = await fetch(`${baseUrl}/kick/${userId}`, {
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

    const isUserProcessing = currentUser.isUserLoading || allUsers.isUsersLoading ||
    deleteRoomMt.isPending || deleteUserMt.isPending || kickMemberMt.isPending ||
    leftRoomMt.isPending;

    return {
        allUsers,
        currentUser,
        deleteRoomMt,
        deleteUserMt,
        isUserProcessing,
        kickMemberMt,
        leftRoomMt
    }
}