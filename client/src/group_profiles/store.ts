import { create } from "zustand";
import type { IGroupProfileState } from "./model";

export const useGroupProfileStore = create<IGroupProfileState>((set) => ({
    groupDescription: "",
    setGroupDescription: (groupDescription) => set({ groupDescription }),

    groupName: "",
    setGroupName: (groupName) => set({ groupName }),

    editMode: false,
    setEditMode: (editMode) => set({ editMode }),
    
    selectedProfileGroup: null,
    setSelectedProfileGroup: (selectedProfileGroup) => set({ selectedProfileGroup }),
    
    selectedProfileGroupUrl: null,
    setSelectedProfileGroupUrl: (selectedProfileGroupUrl) => set({ selectedProfileGroupUrl }),
    
    resetGroupProfileState: () => set({
        editMode: false,
        groupDescription: "",
        selectedProfileGroup: null,
        selectedProfileGroupUrl: null
    }),

    showProfile: false,
    setShowProfile: (showProfile) => set({ showProfile }),
}));