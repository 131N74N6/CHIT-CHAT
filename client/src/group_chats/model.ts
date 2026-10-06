import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IGroupFilePreview {
    file: File;
    file_name: string;
    file_type: string;
    url: string;
}

export interface IGroupChatState {
    chosenFiles: IGroupFilePreview[];
    setChosenFiles: (files: IGroupFilePreview[] | ((prev: IGroupFilePreview[]) => IGroupFilePreview[])) => void;

    chosenMessageFromGroup: IGroupMessage | null;
    setChosenMessageFromGroup: (chosenMessageFromGroup: IGroupMessage | null) => void;

    chosenMessageIdsFromGroup: string[];
    resetChosenMessageIdsFromGroup: () => void;
    setChosenMessageIdsFromGroup: (chosenMessageIdFromGroup: string) => void;

    groupId: string;
    setGroupId: (groupId: string) => void;

    groupMessage: string;
    setGroupMessage: (groupMessage: string) => void;

    groupMessageId: string;
    setGroupMessageId: (groupMessageId: string) => void;

    groupName: string;
    setGroupName: (groupName: string) => void;

    openPopUpOption: boolean;
    setOpenPopUpOption: (openPopUpOption: boolean) => void;
    
    resetGroupMessageState: () => void;

    selectMode: boolean;
    setSelectMode: (selectMode: boolean) => void;

    showGroupChatPopUp: boolean;
    setShowGroupChatPopUp: (showGroupChatPopUp: boolean) => void;

    showFilesPopUp: boolean;
    setFilesPopUp: (showFilesPopUp: boolean) => void;

    showFilePreviewPopUp: boolean;
    setFilePreviewPopUp: (showFilePreviewPopUp: boolean) => void;
}

export interface IGroupMessage {
    _id: string;
    created_at: Date;
    files_total: number;
    text: string;
    sender_name: string;
    sender_id: string;
    updated_at: Date;
}

export interface IGroupMessageData {
    chat: IGroupMessage;
    isProcessing: boolean;
    own: boolean;
}

export interface IGroupMessageList {
    chats: IGroupMessage[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
}

export interface IGroupMessageFiles {
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }[];
}

export interface iPopUpOptionForGroup {
    chosenMessageIds: string[];
    clearAll: UseMutationResult<void, Error, void, unknown>;
    clearChosen: UseMutationResult<void, Error, void, unknown>;
    deleteAll: UseMutationResult<void, Error, void, unknown>;
    deleteChosen: UseMutationResult<void, Error, void, unknown>;
    isProcessing: boolean;
}

export interface IGroupChatPopUp {
    group_chat: {
        chats: IGroupMessage[];
        fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
        isLoading: boolean;
        error: Error | null;
        isProcessing: boolean;
    }
    group_profile: {
        _id: string;
        group_description: string;
        picture: {
            file_name: string;
            file_type: string;
            public_id: string;
            resource_type: string;
            size: number;
            url: string;
        };
        group_name: string;
    }
}