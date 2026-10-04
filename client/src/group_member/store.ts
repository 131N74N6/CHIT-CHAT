import { create } from "zustand";
import type { GroupState } from "./model";

export const useGroupStore = create<GroupState>((set) => ({
    clearChatsIdsSelection: () => set({ selectedChatsIds: [] }),

    deleteGroupImage: null,
    setDeleteGroupImage: (deleteGroupImage) => set({ deleteGroupImage }),

    description: "",
    setDescription: (description) => set({ description }),

    editMode: false,
    setEditMode: (editMode) => set({ editMode }),
    
    isSelectMode: false,
    setIsSelectMode: (isSelectMode) => set({ isSelectMode }),

    oldGroupPicture: null,
    setOldGroupPicture: (oldGroupPicture) => set({ oldGroupPicture }),
    
    resetGroupState: () => set({
        deleteGroupImage: null,
        description: "",
        editMode: false,
        isSelectMode: false,
        oldGroupPicture: null,
        groupId: "",
        groupName: "",
        memberId: "",
        selectedChatsIds: [],
        selectedProfileGroup: null,
        selectedProfileGroupUrl: null,
        showDeleteOption1: false,
        showDeleteOption2: false,
        showGroupMedia: false,
        userChatsIdsToDelete: []
    }),

    groupId: "",
    setGroupId: (groupId: string) => set({ groupId }),

    groupName: "",
    setGroupName: (groupName: string) => set({ groupName }),

    memberId: "",
    setMemberId: (memberId: string) => set({ memberId }),

    selectedChatsIds: [],

    selectedProfileGroup: null,
    setSelectedProfileGroup: (selectedProfileGroup) => set({ selectedProfileGroup }),

    selectedProfileGroupUrl: null,
    setSelectedProfileGroupUrl: (selectedProfileGroupUrl) => set({ selectedProfileGroupUrl }),

    showDeleteOption1: false,
    setShowDeleteOption1: (showDeleteOption1) => set({ showDeleteOption1 }),

    showDeleteOption2: false,
    setShowDeleteOption2: (showDeleteOption2) => set({ showDeleteOption2 }),

    showMember: false,
    setShowMember: (showMember) => set({ showMember }),

    showProfile: false,
    setShowProfile: (showProfile) => set({ showProfile }),

    toggleSelect: (id) => set((state) => ({
        selectedChatsIds: state.selectedChatsIds.includes(id) ?
        state.selectedChatsIds.filter(chatId => chatId !== id) : [...state.selectedChatsIds, id]
    })),

    showGroupMedia: false,
    setShowGroupMedia:(showGroupMedia) => set({ showGroupMedia }),

    userChatsIdsToDelete: [],
    setUserChatsIdsToDelete: (userChatsIdsToDelete) => set((state) => ({
        userChatsIdsToDelete: typeof userChatsIdsToDelete === 'function' ?
        userChatsIdsToDelete(state.userChatsIdsToDelete) : userChatsIdsToDelete
    })),
}));