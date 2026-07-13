import { create } from "zustand";

export interface UserState {
    address: string;
    email: string;
    gender: string;
    password: string;
    profilePicture: File | null;
    profilePictureUrl: string | null;
    oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    username: string;
    visiblepassword: boolean;

    resetSignIn: () => void;
    resetSignUp: () => void;

    setAddress: (address: string) => void;
    setEmail: (email: string) => void;
    setGender: (gender: string) => void;
    setOldProfilePicture: (oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setPassword: (password: string) => void;
    setProfilePicture: (profilePicture: File | null) => void;
    setProfilePictureUrl: (profilePictureUrl: string | null) => void;
    setUserName: (username: string) => void;
    setVisiblePassword: (visiblepassword: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    address: "",
    email: "",
    gender: "",
    password: "",
    profilePicture: null,
    profilePictureUrl: null,
    oldProfile: null,
    username: "",
    visiblepassword: false,

    resetSignIn: () => set({ username: "", password: "" }),
    resetSignUp: () => set({ email: "", username: "", password: "" }),

    setAddress: (address) => set({ address }),
    setEmail: (email) => set({ email }),
    setGender: (gender) => set({ gender }),
    setPassword: (password) => set({ password }),
    setOldProfilePicture: (oldProfile) => set({ oldProfile }),
    setProfilePicture: (profilePicture) => set({ profilePicture }),
    setProfilePictureUrl: (profilePictureUrl) => set({ profilePictureUrl }),
    setUserName: (username) => set({ username }),
    setVisiblePassword: (visiblepassword) => set({ visiblepassword })
}));