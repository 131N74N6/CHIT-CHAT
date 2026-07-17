import { create } from "zustand";

export interface ChatState {
    media: FileList | null;
    setMedia: (media: FileList | null) => void;

    mediaUrl: string[];
    setMediaUrl: (mediaUrl: string[]) => void;

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
    media: null,
    setMedia: (media) => set({ media }),

    mediaUrl: [],
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    resetChats: () => set({ 
        media: null, 
        mediaUrl: [], 
        text: "" 
    }),

    resetChatState: () => set({
        media: null, 
        mediaUrl: [], 
        receiverId: "",
        showUserProfile: false,
        text: "", 
    }),

    showUserProfile: false,
    setShowUserProfile: (showUserProfile) => set({ showUserProfile }),

    text: "",
    setText: (text) => set({ text }),
}));