import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export interface ChatbotState {
    answer: string;
    setAnswer: (answer: string) => void;
    
    resetChatBotState: () => void;
    
    selectMode: boolean;
    setSelectMode: (selectMode: boolean) => void;
    
    selectedChatBotIds: string[];
    resetSelectedChatBotIds: () => void;
    setSelectedChatBotIds: (id: string) => void;

    question: string;
    setQuestion: (question: string) => void;
}

export interface IMessageBot {
    _id: string;
    created_at: string;
    role: string;
    answer?: string;
    question?: string;
    user_id: string;
    question_id?: string;
}

export interface IEachMessageBot {
    results: IMessageBot;
}

export interface IMessageBotList {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<IMessageBot[], unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    results: IMessageBot[];
}