import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatbotStore } from "./store";
import { useUserStore } from "../stores/user.store";
import { useMessageStore } from "../stores/message.store";
import { apiRequest } from "../api";
import type { IMessageBot } from "./model";

export default function useChatbotService() {
    const queryClient = useQueryClient();
    
    const currentUserId = useUserStore((state) => state.currentUserId);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const answer = useChatbotStore((state) => state.answer);
    const setAnswer = useChatbotStore((state) => state.setAnswer);

    const question = useChatbotStore((state) => state.question);
    const setQuestion = useChatbotStore((state) => state.setQuestion);

    const selectedChatBotIds = useChatbotStore((state) => state.selectedChatBotIds);
    const setSelectMode = useChatbotStore((state) => state.setSelectMode);

    const resetSelectedChatBotIds = useChatbotStore((state) => state.resetSelectedChatBotIds);

    const deleteAllMessagesMt = useMutation({
        mutationFn: async () => {
            const endpoint = `/api/v1/chatbots`;
            await apiRequest(endpoint, { method: "DELETE" });
        },
        onError: (response) => {
            setMessage(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            resetSelectedChatBotIds();
            setSelectMode(false);
            setAnswer("");
            setQuestion("");
        }
    });

    const deleteChosenMessagesMt = useMutation({
        mutationFn: async () => {
            const data = JSON.stringify({ ids: selectedChatBotIds });
            const endpoint = `/api/v1/chatbots/bulk`;
            await apiRequest(endpoint, { body: data, method: "DELETE" });
        },
        onError: (response) => {
            setMessage(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            resetSelectedChatBotIds();
            setSelectMode(false)
            setAnswer("");
            setQuestion("");
        }
    });

    const sendQuestionMt = useMutation({
        mutationFn: async () => {
            const data = JSON.stringify({ question: question });
            const endpoint = `/api/v1/chatbots`;
            return await apiRequest<string>(endpoint, { body: data, method: "POST" });
        },
        onError: (response) => {
            setMessage(response.message);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: [`all-results-${currentUserId}`] });
            if (response && response.data) setAnswer(response.data);
            setQuestion("");
            setSelectMode(false)
        }
    });
    
    const showAllBotResults = useInfiniteQuery({
        enabled: !!currentUserId,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < 14) return;
            return allPages.length + 1;
        },
        queryKey: [`all-results-${currentUserId}`],
        queryFn: async ({ pageParam = 1}: { pageParam?: number }) => {
            const endpoint = `/api/v1/chatbots?page=${pageParam}&limit=${28}`;
            const request = await apiRequest<IMessageBot[]>(endpoint, { method: "GET" });
            return request.data ?? [];
        },
        initialPageParam: 1,
        refetchOnReconnect: true,
        staleTime: Infinity
    });

    const isProcessing = [sendQuestionMt, deleteAllMessagesMt, deleteChosenMessagesMt].some((f) => f.isPending);

    return { 
        showAllBotResults, 
        answer, 
        sendQuestionMt, 
        deleteAllMessagesMt, 
        deleteChosenMessagesMt, 
        isProcessing, 
    }
}