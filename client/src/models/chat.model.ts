import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IChatService {
    receiverId?: string;
    roomId?: string;
    setMessage?: (message:  string | null) => void;
}

export interface IFileViewer {
    file: File;
    fileName: string;
    fileType: string;
    previewUrl: string;
}

export interface IUserChatService {
    receiverId?: string;
    setMessage?: (message: string | null) => void;
}

export interface ChatIntrf {
    _id: string;
    created_at: string;
    media: {
        public_id: string;
        resource_type: string;
        url: string;
    }[];
    messages: string;
    receiver_id?: string;
    room_id?: string;
    sender_id: string;
}

export interface ChatBubbleIntrf {
    chat: ChatIntrf;
    isProcessing: boolean;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    own: boolean;
}

export interface ChatListIntrf {
    chats: ChatIntrf[];
    currentUserId: string;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
}