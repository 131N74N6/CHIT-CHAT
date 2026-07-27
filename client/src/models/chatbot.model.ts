import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

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
    question?: string;
    role: string;
    answer?: string;
    question_id?: string;
    user_id?: string;
}

export interface IChatbotBubble {
    result: IChatbot;
    isProcessing: boolean;
    isSelectMode: boolean;
    selectedChatBotIds: string[];
    toggleSelect: (id: string) => void;
}

export interface IChatbotList {
    results: IChatbot[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    isSelectMode: boolean;
    selectedChatBotIds: string[];
    toggleSelect: (id: string) => void;
}