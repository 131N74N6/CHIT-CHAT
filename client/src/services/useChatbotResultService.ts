import type { IChatbot, IChatBotResultService } from "../models/chatbot.model";
import { Query, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useChatbotResultService(props?: IChatBotResultService) {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/chatbots`;
    
    const {
        data: results,
        error: resultsError,
        fetchNextPage: fetchNextResults,
        hasNextPage: resultsHaveNext,
        isFetchingNextPage: resultsFetchNextPage,
        isLoading: isResultsLoading
    } = useInfiniteQuery({
        enabled: !!props?.currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryKey: [`all-results-${props?.currentUserId}`],
        queryFn: async ({ pageParam = 1}: { pageParam?: number }) => {
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
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const paginatedResults = results ? results.pages.flat() : [];

    const allResults = { 
        paginatedResults, 
        resultsError, 
        fetchNextResults, 
        resultsHaveNext, 
        resultsFetchNextPage, 
        isResultsLoading 
    }
    const { data: result, error: resultError, isLoading: isResultLoading } = useQuery<IChatbot>({
        enabled: !!props?._id,
        queryFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/show/${props?._id}`, {
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
        queryKey: [`result-${props?._id}`],
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const currentResult = { result, resultError, isResultLoading }

    const deleteAllResultsMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-all`, {
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
        onError: (response) => {
            props?.setMessage!(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`result-${props?._id}`) ||
                        queryKey[0].startsWith(`all-results-${props?.currentUserId}`);
                    }
                    return false;
                }
            });
        }
    });

    const deleteResultMt = useMutation({
        mutationFn: async (id: string) => {
            try {
                const request = await fetch(`${baseUrl}/rm/${id}`, {
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
        onError: (response) => {
            props?.setMessage!(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`result-${props?._id}`) ||
                        queryKey[0].startsWith(`all-results-${props?.currentUserId}`);
                    }
                    return false;
                }
            });
        }
    });

    return { allResults, currentResult, deleteAllResultsMt, deleteResultMt }
}