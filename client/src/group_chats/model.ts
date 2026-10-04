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

    chosenMessageFromGroup: IGroupChat | null;
    setChosenMessageFromGroup: (chosenMessageFromGroup: IGroupChat | null) => void;

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

    showFilePreviewForGroup: boolean;
    setFilePreviewForGroup: (showFilePreviewForGroup: boolean) => void;

    showFileThatSentToGroup: boolean;
    setFileThatSentToGroup: (showFileThatSentToGroup: boolean) => void;
}

export interface IGroupChat {
    _id: string;
    created_at: Date;
    files_total: number;
    text: string;
    sender_name: string;
    sender_id: string;
    updated_at: Date;
}

export interface IGroupChatData {
    chat: IGroupChat;
    is_processing: boolean;
    own: boolean;
}

export interface IChatList {
    chats: IGroupChat[];
    current_Group_id: string;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
}

export interface IGroupChatFiles {
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }[];
}

export type iPopUpOptionForGroup = {
    chosenMessageIds: string[];
    clearAll: UseMutationResult<void, Error, void, unknown>;
    clearChosen: UseMutationResult<void, Error, void, unknown>;
    deleteAll: UseMutationResult<void, Error, void, unknown>;
    deleteChosen: UseMutationResult<void, Error, void, unknown>;
    isProcessing: boolean;
}