import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { ChatIntrf } from "./chat.model";
import type { NavigateFunction } from "react-router-dom";
import type { IOtherUser } from "./user.model";

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
    setRoomId: (roomId: string) => void;
}

export interface RoomListIntrf {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    rooms: RoomIntrf[];
    setRoomId: (roomId: string) => void;
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
    roomProfile: RoomIntrf;
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
    users: IOtherUser[];
}

export interface IRoomProfileWindow {
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    isRoomOwner: boolean;
    isRoomProfileLoading: boolean;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    roomProfile: RoomIntrf;
    roomProfileError: Error | null;
    seeMember: () => void;
    seeRoomChat: () => void;
}

export interface IRoomWindow {
    currentUserId: string;
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fetchNextRoomChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextRoomChat: boolean;
    isRoomMemberFetchNextPage: boolean;
    isFetchingNextRoomChat: boolean;
    isProcessing: boolean;
    isRoomChatLoading: boolean;
    isRoomMemberLoading: boolean;
    isRoomProfileLoading: boolean;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    roomProfile: RoomIntrf;
    roomChats: ChatIntrf[];
    roomChatError: Error | null;
    roomMemberError: Error | null;
    roomMemberHaveNextPage: boolean;
    roomProfileError: Error | null;
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
    setShowProfile: (showProfile: boolean) => void;
    showProfile: boolean;
    setShowMember: (showMember: boolean) => void;
    showMember: boolean;
    users: IOtherUser[];
}