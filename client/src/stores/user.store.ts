import { create } from "zustand";

export interface UserState {
    address: string;
    email: string;
    gender: string;
    password: string;
    profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    username: string;

    resetSignIn: () => void;
    resetSignUp: () => void;

    setAddress: (address: string) => void;
    setEmail: (email: string) => void;
    setGender: (gender: string) => void;
    setPassword: (password: string) => void;
    setProfilePicture: (profile_picture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setUserName: (username: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
    address: "",
    email: "",
    gender: "",
    password: "",
    profile_picture: null,
    username: "",

    resetSignIn: () => set({ username: "", password: "" }),
    resetSignUp: () => set({ email: "", username: "", password: "" }),

    setAddress: (address) => set({ address }),
    setEmail: (email) => set({ email }),
    setGender: (gender) => set({ gender }),
    setPassword: (password) => set({ password }),
    setProfilePicture: (profile_picture) => set({ profile_picture }),
    setUserName: (username) => set({ username })
}));