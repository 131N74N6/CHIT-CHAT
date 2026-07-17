import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { ChatIntrf } from "./chat.model";
import type { NavigateFunction } from "react-router-dom";
import type { UserIntrf } from "./user.model";

export interface IAvailableRoomService {
    currentUserId?: string;
}

export interface IChangeRoom {
    currentUserId?: string;
    roomId?: string;
    setMessage?: (message: string | null) => void;
}

export interface ICreateRoom {
    currentUserId?: string;
    setMessage?: (message: string | null) => void;
}

export interface IJoinRoom {
    setMessage?: (message: string | null) => void;
}

export interface IRoomChatService {
    roomId?: string;
    setMessage?: (message:  string | null) => void;
}

export interface IRoomMemberService {
    roomId?: string;
}

export interface IRoomProfileService {
    roomId?: string;
}

export interface RoomIntrf {
    _id: string;
    created_at: string;
    creator_id: string;
    description: string;
    name: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    };
}

export interface RoomItemIntrf {
    isProcessing: boolean;
    room: RoomIntrf;
    setCreatedAt: (createdAt: string) => void;
    setDescription: (description: string) => void;
    setRoomId: (roomId: string) => void;
    setRoomName: (roomName: string) => void;
    setRoomProfilePicture: (roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
}

export interface RoomListIntrf {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    rooms: RoomIntrf[];
    setCreatedAt: (createdAt: string) => void;
    setDescription: (description: string) => void;
    setRoomId: (roomId: string) => void;
    setRoomName: (roomName: string) => void;
    setRoomProfilePicture: (roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
}

export interface IRoomChatWindow {
    currentUserId: string;
    fetchNextRoomChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextRoomChat: boolean;
    isFetchingNextRoomChat: boolean;
    isProcessing: boolean;
    isRoomChatLoading: boolean;
    navigate: NavigateFunction;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    roomChats: ChatIntrf[];
    roomChatError: Error | null;
    roomName: string;
    roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
    seeProfile: () => void;
}

export interface IRoomMemberWindow {
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    isRoomMemberFetchNextPage: boolean;
    isRoomMemberLoading: boolean;
    roomMemberError: Error | null;
    roomMemberHaveNextPage: boolean;
    seeProfile: () => void;
    users: UserIntrf[];
}

export interface IRoomProfileWindow {
    createdAt: string;
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    description: string;
    isProcessing: boolean;
    isRoomOwner: boolean;
    isRoomProfileLoading: boolean;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    roomId: string;
    roomName: string;
    roomProfileError: Error | null;
    roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    seeMember: () => void;
    seeRoomChat: () => void;
}

export interface IRoomWindow {
    createdAt: string;
    currentUserId: string;
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    description: string;
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fetchNextRoomChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextRoomChat: boolean;
    isRoomMemberFetchNextPage: boolean;
    isFetchingNextRoomChat: boolean;
    isLoading: boolean;
    isProcessing: boolean;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    roomChats: ChatIntrf[];
    roomChatError: Error | null;
    roomId: string;
    roomMemberError: Error | null;
    roomMemberHaveNextPage: boolean;
    roomName: string;
    roomProfileError: Error | null;
    roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
    setShowProfile: (showProfile: boolean) => void;
    showProfile: boolean;
    setShowMember: (showMember: boolean) => void;
    showMember: boolean;
    users: UserIntrf[];
}