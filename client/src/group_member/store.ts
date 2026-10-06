import { create } from "zustand";
import type { IGroupMemberState } from "./model";

export const useGroupMemberStore = create<IGroupMemberState>((set) => ({
    showMemberPopUp: false,
    setShowMemberPopUp: (showMemberPopUp) => set({ showMemberPopUp }),

    resetGroupMemberState: () => set({ showMemberPopUp: false })
}));