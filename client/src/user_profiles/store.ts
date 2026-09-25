import { create } from "zustand";
import type { UserState } from "./model";
import { persist } from "zustand/middleware";

export const useUserStore = create<UserState>()(persist((set) => ({
    address: "",
    setAddress: (address) => set({ address }),

    currentUserId: undefined,
    setCurrentUserId: (currentUserId) => set({ currentUserId }),

    currentUserRoomIds: undefined,
    setCurrentUserRoomIds: (currentUserRoomIds) => set({ currentUserRoomIds }),

    description: "",
    setDescription: (description) => set({ description }),

    editMode: false,
    setEditMode: (editMode) => set({ editMode }),
    
    gender: "",
    setGender: (gender) => set({ gender }),

    oldProfile: null,
    setOldProfilePicture: (oldProfile) => set({ oldProfile }),

    profilePicture: null,
    setProfilePicture: (profilePicture) => set({ profilePicture }),

    profilePictureUrl: null,
    setProfilePictureUrl: (profilePictureUrl) => set({ profilePictureUrl }),

    resetUserState: () => set({
        address: "",
        currentUserId: undefined,
        currentUserRoomIds: undefined,
        description: "",
        editMode: false,
        oldProfile: null,
        profilePicture: null,
        profilePictureUrl: null,
        roomCode: "",
        username: "",
    }),
    
    roomCode: "",
    setRoomCode: (roomCode) => set({ roomCode }),

    username: "",
    setUserName: (username) => set({ username }),
}), {
    name: "user_info",
    partialize: (state) =>({
        currentUserId: state.currentUserId
    })}
));