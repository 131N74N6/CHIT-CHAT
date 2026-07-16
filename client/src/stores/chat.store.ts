import { create } from "zustand";

export interface ChatState {
    media: FileList | null;
    setMedia: (media: FileList | null) => void;

    mediaUrl: string[];
    setMediaUrl: (mediaUrl: string[]) => void;

    text: string;
    setText: (text: string) => void;

    resetChats: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    media: null,
    setMedia: (media) => set({ media }),

    mediaUrl: [],
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),

    text: "",
    setText: (text) => set({ text }),

    resetChats: () => set({ media: null, mediaUrl: [], text: "" })
}));