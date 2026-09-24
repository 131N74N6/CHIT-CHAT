import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export interface IUserChat {
    _id: string;
    created_at: Date;
    files: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }[];
    files_total: number;
    text: string;
    receiver_id: string;
    sender_id: string;
    updated_at: Date;
}

export interface IUserChatData {
    chat: IUserChat;
    is_processing: boolean;
    own: boolean;
}

export interface IChatList {
    chats: IUserChat[];
    current_user_id: string;
    fetch_next_page: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    has_next_page: boolean;
    is_fetching_next_page: boolean;
    is_processing: boolean;
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

    resetChatState: () => void;
    
    showSentUserMedia: boolean;
    setShowSentUserMedia: (showSentUserMedia: boolean) => void;
    
    showUserMedia: boolean;
    setShowUserMedia: (showUserMedia: boolean) => void;

    openPopUpOption: boolean;
    setOpenPopUpOption: (openPopUpOption: boolean) => void;

    selectMode: boolean;
    setSelectMode: (selectMode: boolean) => void;
    
    showUserProfile: boolean;
    setShowUserProfile: (showUserProfile: boolean) => void;
    
    text: string;
    setText: (text: string) => void;
}