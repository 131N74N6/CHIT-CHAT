import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

export interface GroupState {
    clearChatsIdsSelection: () => void;

    deleteGroupImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setDeleteGroupImage: (deleteGroupImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    description: string;
    setDescription: (description: string) => void;

    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;

    oldGroupPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setOldGroupPicture: (oldGroupPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    groupId: string;
    setGroupId: (GroupId: string) => void;

    groupName: string;
    setGroupName: (GroupName: string) => void;

    memberId: string;
    setMemberId: (memberId: string) => void;
    
    resetGroupState: () => void;

    selectedChatsIds: string[];
    
    selectedProfileGroup: File | null;
    setSelectedProfileGroup: (selectedProfileGroup: File | null) => void;

    selectedProfileGroupUrl: string | null;
    setSelectedProfileGroupUrl: (selectedProfileGroupUrl: string | null) => void;
    
    showDeleteOption1: boolean;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    
    showDeleteOption2: boolean;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;

    showMember: boolean;
    setShowMember: (showMember: boolean) => void;
    
    showGroupMedia: boolean;
    setShowGroupMedia: (showGroupMedia: boolean) => void;

    showProfile: boolean;
    setShowProfile: (showProfile: boolean) => void;

    toggleSelect: (id: string) => void;
    
    userChatsIdsToDelete: string[];
    setUserChatsIdsToDelete: (userChatsIdsToDelete: string[] | ((prev: string[]) => string[])) => void;
}

export interface GroupMembersMarks {
    isGroupOwner: UseQueryResult<boolean, Error>;
    kickMemberMt: UseMutationResult<any, Error, string, unknown>;
    name: "group-member";
}