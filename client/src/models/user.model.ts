import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { ChatIntrf } from "./chat.model";

export interface IAuthService {
    setMessage?: (message: string | null) => void;
}

export interface IChangeUser extends IAuthService {}

export interface IUserProfileService {
    receiverId?: string;
}

export interface IUserService extends IAuthService {
    roomId?: string;
}

export interface IUserChatWindow {
    currentUserId: string;
    fetchNextUserChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextUserChat: boolean;
    isFetchingNextUserChats: boolean;
    isUserChatLoading: boolean;
    isProcessing: boolean;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    receiverId: string;
    seeProfile: () => void;
    sendChatToUser: UseMutationResult<any, Error, void, unknown>;
    userChats: ChatIntrf[];
    userChatError: Error | null;
    userProfile: IOtherUser;
}

export interface IUserProfileWindow {
    isProfileLoading: boolean;
    errorProfile: Error | null;
    seeUserChat: () => void;
    userProfile: IOtherUser;
}

export interface IUserWindow {
    currentUserId: string;
    errorProfile: Error | null;
    fetchNextUserChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextUserChat: boolean;
    isFetchingNextUserChats: boolean;
    isUserChatLoading: boolean;
    isProcessing: boolean;
    isProfileLoading: boolean;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    receiverId: string;
    sendChatToUser: UseMutationResult<any, Error, void, unknown>;
    setShowUserProfile: (showUserProfile: boolean) => void;
    showUserProfile: boolean;
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
    users: IOtherUser[];
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    setReceiverId?: (receiverId: string) => void;
}

export interface UserItemIntrf {
    setReceiverId?: (receiverId: string) => void;
    user: IOtherUser;
}