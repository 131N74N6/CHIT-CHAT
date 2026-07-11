import { create } from "zustand";

export interface ChatState {
    media: File[] | null;
    mediaUrl: string[];
    messages: string;

    resetChats: () => void;

    setMediaUrl: (mediaUrl: string[]) => void;
    setMedia: (media: File[] | null) => void;
    setMessages: (messages: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    media: null,
    mediaUrl: [],
    messages: "",

    resetChats: () => set({ media: null, mediaUrl: [], messages: "" }),

    setMedia: (media) => set({ media }),
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),
    setMessages: (messages) => set({ messages })
}));