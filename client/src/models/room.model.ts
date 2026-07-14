import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export interface IRoomService {
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
}

export interface RoomListIntrf {
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    rooms: RoomIntrf[];
    setRoomId: (roomId: string) => void;
}