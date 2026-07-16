import { create } from "zustand";

export interface ChatState {
    media: File[] | null;
    setMedia: (media: File[] | null) => void;

    mediaUrl: string[];
    setMediaUrl: (mediaUrl: string[]) => void;

    messages: string;
    setMessages: (messages: string) => void;

    resetChats: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    media: null,
    setMedia: (media) => set({ media }),

    mediaUrl: [],
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),

    messages: "",
    setMessages: (messages) => set({ messages }),

    resetChats: () => set({ media: null, mediaUrl: [], messages: "" })
}));