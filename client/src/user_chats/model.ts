import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IUserChat {
    _id: string;
    created_at: Date;
    files_total: number;
    text: string;
    receiver_id: string;
    sender_id: string;
    updated_at: Date;
}

export interface IUserMessageData {
    chat: IUserChat;
    isProcessing: boolean;
    own: boolean;
}

export interface IUserMessageList {
    chats: IUserChat[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
}

export interface IUserChatFiles {
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }[];
    isLoading: boolean;
}

export interface IUserChatFile {
    message_file: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    };
    isLoading: boolean;
}

export interface IFilePreview {
    file: File;
    file_name: string;
    file_type: string;
    url: string;
}

export interface IUserChatState {
    chosenMessage: IUserChat | null;
    setChosenMessage: (chosenMessage: IUserChat | null) => void;

    chosenMessageId: string;
    setChosenMessageId: (chosenMessageId: string) => void;

    chosenMessageIds: string[];
    resetChosenMessageIds: () => void;
    setChosenMessageIds: (chosenMessageId: string) => void;

    chosenFiles: IFilePreview[];
    setChosenFiles: (files: IFilePreview[] | ((prev: IFilePreview[]) => IFilePreview[])) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    removeOneFile: (filename: string) => void;
    resetChatState: () => void;
    
    showUserChatFilesPopUp: boolean;
    setShowUserChatFilesPopUp: (showUserChatFilesPopUp: boolean) => void;
    
    showUserMedia: boolean;
    setShowUserMedia: (showUserMedia: boolean) => void;

    openPopUpOption: boolean;
    setOpenPopUpOption: (openPopUpOption: boolean) => void;

    selectMode: boolean;
    setSelectMode: (selectMode: boolean) => void;
    
    showUserChatPopUp: boolean;
    setShowUserChatPopUp: (showUserChatPopUp: boolean) => void;
    
    text: string;
    setText: (text: string) => void;
}

export interface iPopUpOptionForUser {
    chosenMessageIds: string[];
    clearAll: UseMutationResult<void, Error, void, unknown>;
    clearChosen: UseMutationResult<void, Error, void, unknown>;
    deleteAll: UseMutationResult<void, Error, void, unknown>;
    deleteChosen: UseMutationResult<void, Error, void, unknown>;
    isProcessing: boolean;
}

export interface IUserChatPopUp {
    isProcessing: boolean;
    userChat: {
        data: IUserChat[];
        error: Error | null;
        fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
        isLoading: boolean;
    }
    userProfile: {
        error: Error | null;
        image: string;
        image_public_id: string;
        isLoading: boolean;
        name: string;
    }
}

export interface IUserChatFilesPreviewPopUp {
    handleMediaPreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    isProcessing: boolean;
    inputMediaRef: React.RefObject<HTMLInputElement | null>;
    sendMessageMt: UseMutationResult<void, Error, void, unknown>
}

export interface IUserChatFilesPopUp {
    error: Error | null;
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }[];
    isProcessing: boolean;
    isLoading: boolean;
}