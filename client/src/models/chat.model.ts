import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { IOtherUser } from "./user.model";

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

export interface ChatIntrf {
    _id: string;
    created_at: string;
    media: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        url: string;
    }[];
    messages: string;
    receiver_id?: string;
    room_id?: string;
    sender_id: string;
    sender_name: string;
}

export interface IChatBubble {
    chat: ChatIntrf;
    isProcessing: boolean;
    isInRoom: boolean;
    isSelectMode: boolean;
    own: boolean;
    place: IRoomChat | IUserChat; 
    selectedIds: string[];
    setChatId: (chatId: string) => void;
    toggleSelect: (id: string) => void;
}

export interface IChatList {
    chats: ChatIntrf[];
    currentUserId: string;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isInRoom: boolean;
    isProcessing: boolean;
    isSelectMode: boolean;
    place: IRoomChat | IUserChat; 
    selectedIds: string[];
    setChatId: (chatId: string) => void;
    toggleSelect: (id: string) => void;
}

export type IChatFileIcon = {
    file_name: string;
    file_type: string;
    public_id: string;
    resource_type: string;
    url: string;
}

export type IChatMedia = {
    file: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        url: string;
    };
    is_processing: boolean;
}

export type IChatMediaList = {
    files: IChatFileIcon[];
    is_processing: boolean;
}

export interface IRoomChat {
    name: "room-chat";
    setReceiverId: (receiverId: string) => void;
}

export interface IUserChat {
    name: "user-chat";
    setReceiverId?: never;
}

export interface IUserChatMedia {
    handleMediaPreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    inputMediaRef: React.RefObject<HTMLInputElement | null>;
    isUserChatProcessing: boolean;
    media: IFileViewer[];
    removeOnePreviewFile: (fileName: string) => void;
    seeChat: () => void;
    sendChatToUserMt: UseMutationResult<any, Error, void, unknown>;
    setText: (text: string) => void;
    text: string;
}

export interface IUserChatWindow {
    clearSelection: () => void;
    currentUserId: string;
    fetchNextUserChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextUserChat: boolean;
    isFetchingNextUserChats: boolean;
    isUserChatProcessing: boolean;
    isProcessing: boolean;
    isSelectMode: boolean;
    receiverId: string;
    text: string;
    seeMedia: () => void;
    seeProfile: () => void;
    selectedIds: string[];
    sendChatToUser: UseMutationResult<any, Error, void, unknown>;
    setChatId: (chatId: string) => void;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setReceiverId: (receiverId: string) => void;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
    setText: (text: string) => void;
    toggleSelect: (id: string) => void;
    userChats: ChatIntrf[];
    userChatError: Error | null;
    userProfile: IOtherUser;
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