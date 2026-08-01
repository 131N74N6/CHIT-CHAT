import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ChatIntrf, IFileViewer } from "./chat.model";
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

export interface IRoomChatDeleteOption1 {
    clearAllRoomChatsForMeMt: UseMutationResult<any, Error, void, unknown>;
    deleteAllChatsInRoomMt: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setShowDeleteOption1: (showDeleteOption: boolean) => void;
}

export interface IRoomChatDeleteOption2 {
    clearChosenRoomChatsForMeMt: UseMutationResult<any, Error, void, unknown>;
    clearSelection: () => void;
    deleteChosenChatsInRoomMt: UseMutationResult<any, Error, void, unknown>;
    isProcessing: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setShowDeleteOption2: (showDeleteOption: boolean) => void;
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
    clearChatsIdsSelection: () => void;
    currentUserId: string;
    fetchNextRoomChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>
    hasNextRoomChat: boolean;
    isFetchingNextRoomChat: boolean;
    isRoomChatLoading: boolean;
    isRoomChatProcessing: boolean;
    isSelectMode: boolean;
    roomChats: ChatIntrf[];
    roomChatError: Error | null;
    roomId: string;
    roomProfile: RoomIntrf;
    seeMedia: () => void;
    selectedIds: string[];
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setReceiverId: (receiverId: string) => void;
    setRoomId: (roomId: string) => void;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
    setText: (text: string) => void;
    seeProfile: () => void;
    text: string;
    toggleSelect: (id: string) => void;
}

export interface IRoomChatMedia {
    handleMediaPreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    inputMediaRef: React.RefObject<HTMLInputElement | null>;
    isRoomChatProcessing: boolean;
    media: IFileViewer[];
    removeOnePreviewFile: (fileName: string) => void;
    seeChat: () => void;
    sendChatToRoomMt: UseMutationResult<any, Error, void, unknown>;
    setText: (text: string) => void;
    text: string;
}

export interface IRoomMemberWindow {
    currentUserId: string;
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    kickMemberMt: UseMutationResult<any, Error, string, unknown>;
    isOwnData: UseQueryResult<boolean, Error>;
    isRoomMemberFetchNextPage: boolean;
    isRoomMemberLoading: boolean;
    isRoomOwner: UseQueryResult<boolean, Error>;
    roomMemberError: Error | null;
    roomMemberHaveNextPage: boolean;
    seeProfile: () => void;
    setReceiverId: (receiverId: string) => void;
    users: IOtherUser[];
}

export interface IRoomProfileWindow {
    changeRoomMt: UseMutationResult<any, Error, void, unknown>;
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    description: string;
    editMode: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImagePreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    isRoomOwner: boolean;
    isRoomProfileLoading: boolean;
    isRoomProfileProcessing: boolean;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    roomName: string;
    roomProfile: RoomIntrf;
    roomProfileError: Error | null;
    seeMember: () => void;
    seeRoomChat: () => void;
    selectedProfileRoom: File | null;
    selectedProfileRoomUrl: string | null;
    setDeleteRoomImage: (deleteRoomImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setDescription: (description: string) => void;
    setEditMode: (editMode: boolean) => void;
    setOldRoomPicture: (oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setRoomName: (roomName: string) => void;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;
}

export interface IRoomWindow {
    changeRoomMt: UseMutationResult<any, Error, void, unknown>;
    clearChatsIdsSelection: () => void;
    currentUserId: string;
    deleteRoomMt: UseMutationResult<any, Error, void, unknown>;
    description: string;
    editMode: boolean;
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fetchNextRoomChat: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleImagePreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    handleMediaPreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
    hasNextRoomChat: boolean;
    inputMediaRef: React.RefObject<HTMLInputElement | null>;
    isOwnData: UseQueryResult<boolean, Error>;
    isRoomMemberFetchNextPage: boolean;
    isFetchingNextRoomChat: boolean;
    isRoomChatLoading: boolean;
    isRoomChatProcessing: boolean;
    isRoomMemberLoading: boolean;
    isRoomOwner: UseQueryResult<boolean, Error>;
    isRoomProfileLoading: boolean;
    isRoomProfileProcessing: boolean;
    isSelectMode: boolean;
    kickMemberMt: UseMutationResult<any, Error, string, unknown>;
    leftRoomMt: UseMutationResult<any, Error, void, unknown>;
    media: IFileViewer[];
    oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    removeOnePreviewFile: (fileName: string) => void;
    roomProfile: RoomIntrf;
    roomChats: ChatIntrf[];
    roomChatError: Error | null;
    roomId: string;
    roomMemberError: Error | null;
    roomMemberHaveNextPage: boolean;
    roomName: string;
    roomProfileError: Error | null;
    selectedChatsIds: string[];
    selectedProfileRoom: File | null;
    selectedProfileRoomUrl: string | null;
    sendChatToRoom: UseMutationResult<any, Error, void, unknown>;
    setDeleteRoomImage: (deleteRoomImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setDescription: (description: string) => void;
    setEditMode: (editMode: boolean) => void;
    setIsSelectMode: (isSelectMode: boolean) => void;
    setOldRoomPicture: (oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setRoomId: (roomId: string) => void;
    setRoomName: (roomName: string) => void;
    setReceiverId: (receiverId: string) => void;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
    setShowProfile: (showProfile: boolean) => void;
    setShowRoomMedia: (showRoomMedia: boolean) => void;
    setText: (text: string) => void;
    showProfile: boolean;
    showRoomMedia: boolean;
    setShowMember: (showMember: boolean) => void;
    showMember: boolean;
    text: string;
    toggleSelect: (id: string) => void;
    users: IOtherUser[];
}