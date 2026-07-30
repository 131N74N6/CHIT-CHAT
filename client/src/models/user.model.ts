import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { ChatIntrf, IFileViewer } from "./chat.model";

export interface IAuthService {
    setMessage?: (message: string | null) => void;
}

export interface IUserProfileService extends IAuthService {
    receiverId?: string;
}

export interface IUserProfileWindow {
    isProfileLoading: boolean;
    isSelectMode: boolean;
    errorProfile: Error | null;
    seeUserChat: () => void;
    userProfile: IOtherUser;
}

export interface IUserWindow {
    clearSelection: () => void;
    currentUserId: string;
    errorProfile: Error | null;
    fetchNextUserChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    handleMediaPreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    hasNextUserChat: boolean;
    inputMediaRef: React.RefObject<HTMLInputElement | null>;
    isFetchingNextUserChats: boolean;
    isUserChatProcessing: boolean;
    isProcessing: boolean;
    isProfileLoading: boolean;
    isSelectMode: boolean;
    media: IFileViewer[];
    receiverId: string;
    removeOnePreviewFile: (fileName: string) => void;
    sendChatToUser: UseMutationResult<any, Error, void, unknown>;
    selectedIds: string[];
    setIsSelectMode: (isSelectMode: boolean) => void;
    setReceiverId: (receiverId: string) => void;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
    setShowUserMedia: (showUserMedia: boolean) => void;
    setShowUserProfile: (showUserProfile: boolean) => void;
    setText: (text: string) => void;
    showUserMedia: boolean;
    showUserProfile: boolean;
    text: string;
    toggleSelect: (id: string) => void;
    userChats: ChatIntrf[];
    userChatError: Error | null;
    userProfile: IOtherUser;
}

export interface IUserProfile {
    address: string;
    created_at: string;
    gender: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    }
    room_id: string[];
    user_id: string;
    username: string;
}

export interface IOtherUser {
    _id: string;
    address: string;
    created_at: string;
    gender: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    }
    username: string;
}

export interface UserListIntrf {
    currentUserId: string;
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    place: IRoomMember | IListOfUsers;
    isProcessing: boolean;
    setReceiverId: (receiverId: string) => void;
    users: IOtherUser[];
}

export interface UserItemIntrf {
    isProcessing: boolean;
    place: IRoomMember | IListOfUsers;
    own: boolean;
    setReceiverId: (receiverId: string) => void;
    user: IOtherUser;
}

export interface IRoomMember {
    kickMemberMt: UseMutationResult<any, Error, string, unknown>;
    name: "room-member";
}

export interface IListOfUsers {
    kickMemberMt?: never;
    name: "user-list-home";
}