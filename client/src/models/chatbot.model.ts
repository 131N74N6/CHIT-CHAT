import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { NavigateFunction } from "react-router-dom";

export interface IChatBotService {
    _id?: string;
    currentUserId?: string;
    setMessage?: (message:  string | null) => void;
}

export interface IChatbotQuestionServices {
    _id?: string;
    currentUserId?: string;
    setMessage?: (message:  string | null) => void;
}

export interface IChatbot {
    _id: string;
    created_at: string;
    question: string;
    response: string;
    user_id: string;
}

export interface IChatbotList {
    results: IChatbot[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    navigate: NavigateFunction;
    onDelete: UseMutationResult<any, Error, string, unknown>;
}

export interface IChatbotCard {
    isProcessing: boolean;
    navigate: NavigateFunction;
    result: IChatbot;
    onDelete: UseMutationResult<any, Error, string, unknown>;
}