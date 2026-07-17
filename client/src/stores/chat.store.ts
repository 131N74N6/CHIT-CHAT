import { create } from "zustand";

export interface ChatState {
    address: string;
    setAddress: (address: string) => void;

    createdAt: string;
    setCreatedAt: (createdAt: string) => void;

    gender: string;
    setGender: (gender: string) => void;

    media: FileList | null;
    setMedia: (media: FileList | null) => void;

    mediaUrl: string[];
    setMediaUrl: (mediaUrl: string[]) => void;

    name: string;
    setName: (name: string) => void;

    profilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setProfilePicture: (profilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    resetChats: () => void;
    resetChatState: () => void;

    showUserProfile: boolean;
    setShowUserProfile: (showUserProfile: boolean) => void;

    text: string;
    setText: (text: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    address: "",
    setAddress: (address) => set({ address }),

    createdAt: "",
    setCreatedAt: (createdAt) => set({ createdAt }),

    gender: "",
    setGender: (gender) => set({ gender }),

    media: null,
    setMedia: (media) => set({ media }),

    mediaUrl: [],
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),

    name: "",
    setName: (name) => set({ name }),

    profilePicture: null,
    setProfilePicture: (profilePicture) => set({ profilePicture }),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    resetChats: () => set({ 
        media: null, 
        mediaUrl: [], 
        text: "" 
    }),

    resetChatState: () => set({
        address: "",
        createdAt: "",
        gender: "",
        media: null, 
        mediaUrl: [], 
        name: "",
        profilePicture: null,
        receiverId: "",
        showUserProfile: false,
        text: "", 
    }),

    showUserProfile: false,
    setShowUserProfile: (showUserProfile) => set({ showUserProfile }),

    text: "",
    setText: (text) => set({ text }),
}));