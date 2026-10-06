import { create } from "zustand";
import type { IGroupProfileState } from "./model";

export const useGroupProfileStore = create<IGroupProfileState>((set) => ({
    groupDescription: "",
    setGroupDescription: (groupDescription) => set({ groupDescription }),

    groupName: "",
    setGroupName: (groupName) => set({ groupName }),

    editMode: false,
    setEditMode: (editMode) => set({ editMode }),

    oldGroupProfilePicture: {
        file_name: "",
        file_type: "",
        public_id: "",
        resource_type: "",
        size: 0,
        url: "",
    },
    setOldGroupProfilePicture: (oldGroupProfilePicture) => set({ oldGroupProfilePicture }),
    
    resetGroupProfileState: () => set({
        editMode: false,
        groupDescription: "",
        oldGroupProfilePicture: {
            file_name: "",
            file_type: "",
            public_id: "",
            resource_type: "",
            size: 0,
            url: "",
        },
        selectedProfileGroup: null,
        selectedProfileGroupUrl: null
    }),
    
    selectedProfileGroup: null,
    setSelectedProfileGroup: (selectedProfileGroup) => set({ selectedProfileGroup }),
    
    selectedProfileGroupUrl: null,
    setSelectedProfileGroupUrl: (selectedProfileGroupUrl) => set({ selectedProfileGroupUrl }),

    showProfile: false,
    setShowProfile: (showProfile) => set({ showProfile }),
}));