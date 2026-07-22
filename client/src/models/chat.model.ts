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

export interface IUserChatDeleteOption1 {
    clearAllUserChatsForMeMt: UseMutationResult<any, Error, void, unknown>;
    deleteAllUserChatsMt: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
}

export interface IUserChatDeleteOption2 {
    clearChosenUserChatForMeMt: UseMutationResult<any, Error, void, unknown>;
    clearSelection: () => void;
    deleteChosenUsersChatMt: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
}