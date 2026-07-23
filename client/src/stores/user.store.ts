import { create } from "zustand";

export interface UserState {
    address: string;
    setAddress: (address: string) => void;

    deleteProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setDeleteProfilePicture: (deleteProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    editMode: boolean;
    setEditMode: (editMode: boolean) => void;

    email: string;
    setEmail: (email: string) => void;

    gender: string;
    setGender: (gender: string) => void;

    password: string;
    setPassword: (password: string) => void;

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

    resetSignIn: () => void;
    resetUserState: () => void;
    resetSignUp: () => void;

    roomCode: string;
    setRoomCode: (roomCode: string) => void;

    username: string;
    setUserName: (username: string) => void;
    
    visiblepassword: boolean;
    setVisiblePassword: (visiblepassword: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    address: "",
    setAddress: (address) => set({ address }),

    deleteProfilePicture: null,
    setDeleteProfilePicture: (deleteProfilePicture) => set({ deleteProfilePicture }),

    editMode: false,
    setEditMode: (editMode) => set({ editMode }),
    
    email: "",
    setEmail: (email) => set({ email }),
    
    gender: "",
    setGender: (gender) => set({ gender }),

    oldProfile: null,
    setOldProfilePicture: (oldProfile) => set({ oldProfile }),

    password: "",
    setPassword: (password) => set({ password }),

    profilePicture: null,
    setProfilePicture: (profilePicture) => set({ profilePicture }),

    profilePictureUrl: null,
    setProfilePictureUrl: (profilePictureUrl) => set({ profilePictureUrl }),

    resetUserState: () => set({
        deleteProfilePicture: null,
        editMode: false,
        email: "",
        oldProfile: null,
        password: "",
        profilePicture: null,
        profilePictureUrl: null,
        roomCode: "",
        visiblepassword: false,
        username: "",
    }),

    resetSignIn: () => set({ username: "", password: "" }),

    resetSignUp: () => set({ email: "", username: "", password: "" }),
    
    roomCode: "",
    setRoomCode: (roomCode) => set({ roomCode }),

    username: "",
    setUserName: (username) => set({ username }),

    visiblepassword: false,
    setVisiblePassword: (visiblepassword) => set({ visiblepassword })
}));