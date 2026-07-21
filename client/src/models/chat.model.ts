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

export interface IChatBubble {
    chat: ChatIntrf;
    isProcessing: boolean;
    isSelectMode: boolean;
    own: boolean;
    selectedIds: string[];
    toggleSelect: (id: string) => void;
}

export interface IChatList {
    chats: ChatIntrf[];
    currentUserId: string;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    isSelectMode: boolean;
    selectedIds: string[];
    toggleSelect: (id: string) => void;
}

export interface IUserChatDeleteOption {
    clearAllUserChatsForMeMt?: UseMutationResult<any, Error, void, unknown>;
    clearChosenUserChatForMeMt?: UseMutationResult<any, Error, void, unknown>;
    deleteAllUserChatsMt?: UseMutationResult<any, Error, void, unknown>;
    deleteChosenUsersChatMt?: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    marks: number;
    setIsSelectMode?: (isSelectMode: boolean) => void;
    setShowDeleteOption?: (showDeleteOption: boolean) => void;
}