import { Query, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IChatbotQuestionServices } from "../models/chatbot.model";
import { useChatbotStore } from "../stores/chatbot.store";

export default function ChatbotServices(props?: IChatbotQuestionServices) {
    const queryClient = useQueryClient();
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/chatbots`;

    const question = useChatbotStore((state) => state.question);
    const setQuestion = useChatbotStore((state) => state.setQuestion);

    const askAiMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${baseUrl}/ask-ai`, {
                    body: JSON.stringify({ question: question.trim() }),
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

    return { askAiMt, question, setQuestion }
}