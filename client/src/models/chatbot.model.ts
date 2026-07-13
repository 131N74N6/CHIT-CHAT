import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IChatbotServices {
    _id?: string;
    setMessage?: (message:  string | null) => void;
}

export interface ChatbotIntrf {
    _id: string;
    created_at: string;
    question: string;
    response: string;
    user_id: string;
}

export interface ChatbotListIntrf {
    results: ChatbotIntrf[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onDelete: UseMutationResult<any, Error, string, unknown>;
}

export interface ChatBotItemIntrf {
    result: ChatbotIntrf;
    onDelete: UseMutationResult<any, Error, string, unknown>;
}