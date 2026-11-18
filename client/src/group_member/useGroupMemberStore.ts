import { create } from "zustand";
import type { IGroupMemberState } from "./model";

export const useGroupMemberStore = create<IGroupMemberState>((set) => ({
    searchedGroupMember: "",
    setSearchedGroupMember: (searchedGroupMember) => set({ searchedGroupMember }),

    showMemberPopUp: false,
    setShowMemberPopUp: (showMemberPopUp) => set({ showMemberPopUp }),

    resetGroupMemberState: () => set({ 
        searchedGroupMember: "",
        showMemberPopUp: false 
    })
}));