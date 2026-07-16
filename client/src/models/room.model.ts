import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { ChatIntrf } from "./chat.model";

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

export interface IRoomService {
    currentUserId?: string;
    receiverId?: string;
    roomId?: string;
    setMessage?: (message:  string | null) => void;
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
    setRoomId: (roomId: string) => void;
    setRoomName: (roomName: string) => void;
    setRoomProfilePicture: (roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
}

export interface RoomChatWindowIntrf {
    currentUserId: string;
    error: Error | null;
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isProcessing: boolean;
    onClearOne: UseMutationResult<any, Error, string, unknown>;
    onDeleteOnePermanent: UseMutationResult<any, Error, string, unknown>;
    onDeleteOne: UseMutationResult<any, Error, string, unknown>;
    roomChats: ChatIntrf[];
    roomId: string;
    roomName: string;
    roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
}