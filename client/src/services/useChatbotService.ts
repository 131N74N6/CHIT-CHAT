import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatbotStore } from "../stores/chatbot.store";
import { useUserStore } from "../stores/user.store";
import { useMessageStore } from "../stores/message.store";

export default function useChatbotService() {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/chatbots`;
    
    const currentUserId = useUserStore((state) => state.currentUserId);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const answer = useChatbotStore((state) => state.answer);
    const setAnswer = useChatbotStore((state) => state.setAnswer);

    const question = useChatbotStore((state) => state.question);
    const setQuestion = useChatbotStore((state) => state.setQuestion);

    const clearSelectedResults = useChatbotStore((state) => state.clearSelectedResults);

    const isSelectMode = useChatbotStore((state) => state.isSelectMode);
    const setIsSelectMode = useChatbotStore((state) => state.setIsSelectMode);

    const selectedChatBotIds = useChatbotStore((state) => state.selectedChatBotIds);

    const toggleSelect = useChatbotStore((state) => state.toggleSelect);
    
    const {
        data: results,
        error: resultsError,
        fetchNextPage: fetchNextResults,
        hasNextPage: resultsHaveNext,
        isFetchingNextPage: resultsFetchNextPage,
        isLoading: isResultsLoading
    } = useInfiniteQuery({
        enabled: !!currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length <= 14) return;
            return allPages.length + 1;
        },
        queryKey: [`all-results-${currentUserId}`],
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

    const askAiMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/ask-ai`, {
                    body: JSON.stringify({ question: question.trim() }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (response) => {
            setMessage(response.message);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            setAnswer(response.message);
            setQuestion("");
        }
    });

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
            setMessage(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            setQuestion("");
        }
    });

    const deleteChosenResultsMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/rm-chosen`, {
                    body: JSON.stringify({ selectedIds: selectedChatBotIds }),
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
            setMessage(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            setQuestion("");
        }
    });

    const isChatbotProcessing = allResults.isResultsLoading || askAiMt.isPending ||
    deleteAllResultsMt.isPending || deleteChosenResultsMt.isPending;

    return { 
        allResults, 
        answer, 
        askAiMt, 
        clearSelectedResults,
        deleteAllResultsMt, 
        deleteChosenResultsMt, 
        isChatbotProcessing, 
        isSelectMode,
        question, 
        selectedChatBotIds,
        setAnswer, 
        setIsSelectMode,
        setQuestion, 
        toggleSelect,
    }
}