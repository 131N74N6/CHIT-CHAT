import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";
import type { GroupMembersMarks } from "../group_member/model";

export interface UserState {
    address: string;
    setAddress: (address: string) => void;

    currentUserId: string | undefined;
    setCurrentUserId: (currentUserId: string | undefined) => void;

    currentUserRoomIds: string[] | undefined;
    setCurrentUserRoomIds: (currentUserRoomIds: string[] | undefined) => void;

    description: string;
    setDescription: (description: string) => void;

    editMode: boolean;
    setEditMode: (editMode: boolean) => void;

    gender: string;
    setGender: (gender: string) => void;

    groupIds: string[];
    setGroupIds: (groupIds: string[]) => void;

    profilePicture: File | null;
    setProfilePicture: (profilePicture: File | null) => void;

    profilePictureUrl: string | null;
    setProfilePictureUrl: (profilePictureUrl: string | null) => void;

    oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setOldProfilePicture: (oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    resetUserState: () => void;

    roomCode: string;
    setRoomCode: (roomCode: string) => void;

    username: string;
    setUserName: (username: string) => void;
}

export interface UserDetail {
    _id: string;
    address: string;
    createdAt: Date;
    description: string;
    gender: string;
    image: string;
    image_public_id: string;
    name: string;
}

export interface Users {
    _id: string;
    image: string;
    image_public_id: string;
    name: string;
}

export interface UserList {
    users: Users[];
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<Users[], unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
    place: GroupMembersMarks | UsersMarks;
}

export interface UserData {
    isProcessing: boolean;
    isOwnData: boolean;
    place: GroupMembersMarks | UsersMarks;
    user: Users;
}

export interface UsersMarks {
    isGroupOwner?: never;
    kickMemberMt?: never;
    name: "user-list-home";
}