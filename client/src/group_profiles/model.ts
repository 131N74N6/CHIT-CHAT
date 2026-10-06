import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";

export interface IGroupProfileState {
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;

    groupDescription: string;
    setGroupDescription: (groupDescription: string) => void;

    groupName: string;
    setGroupName: (groupName: string) => void;

    oldGroupProfilePicture: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    };
    setOldGroupProfilePicture: (oldGroupProfilePicture: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    }) => void
    
    resetGroupProfileState: () => void;
    
    selectedProfileGroup: File | null;
    setSelectedProfileGroup: (selectedProfileGroup: File | null) => void;

    selectedProfileGroupUrl: string | null;
    setSelectedProfileGroupUrl: (selectedProfileGroupUrl: string | null) => void;

    showProfile: boolean;
    setShowProfile: (showProfile: boolean) => void;
}

export interface IGroups {
    _id: string;
    group_name: string
    group_profile: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    };
}

export interface IGroupProfileData {
    group: IGroups;
    isProcessing: boolean;
}

export interface IGroupProfileDetail {
    _id: string;
    created_at: Date;
    group_description: string;
    group_profile: {
        file_name: string;
        file_type: string;
        public_id: string;
        resource_type: string;
        size: number;
        url: string;
    };
    group_name: string;
    owner_id: string;
}

export interface IGroupProfileList {
    groups: IGroups[];
    fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    isProcessing: boolean;
}

export interface IGroupProfileDetailPopUp {
    groupMember: {
        leftGroupMt: UseMutationResult<unknown, Error, void, unknown>;
    }
    groupProfile: {
        _id: string;
        changeGroupMt: UseMutationResult<void, Error, void, unknown>;
        created_at: Date;
        deleteGroupMt: UseMutationResult<void, Error, void, unknown>;
        deleteGroupProfilePictureMt: UseMutationResult<void, Error, void, unknown>
        description: string;
        error: Error | null;
        fileInputRef: React.RefObject<HTMLInputElement | null>;
        handleImagePreview: (event: React.ChangeEvent<HTMLInputElement, Element>) => void;
        picture: {
            file_name: string;
            file_type: string;
            public_id: string;
            resource_type: string;
            size: number;
            url: string;
        };
        group_name: string;
        isLoading: boolean;
        isGroupOwner: boolean;
        isOwnerId: boolean;
    }
    isProcessing: boolean;
}