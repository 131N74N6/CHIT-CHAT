import { create } from "zustand";
import type { IFileViewer } from "../models/chat.model";

export interface ChatState {
    media: IFileViewer[];
    setMedia: (media: IFileViewer[] | ((prev: IFileViewer[]) => IFileViewer[])) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    resetChats: () => void;
    resetChatState: () => void;

    showUserMedia: boolean;
    setShowUserMedia: (showUserMedia: boolean) => void;

    showUserProfile: boolean;
    setShowUserProfile: (showUserProfile: boolean) => void;

    text: string;
    setText: (text: string) => void;

    userChatsIdsToDelete: string[];
    setUserChatsIdsToDelete: (userChatsIdsToDelete: string[] | ((prev: string[]) => string[])) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    media: [],
    setMedia: (media) => set((state) => ({ 
        media: typeof media === 'function' ? media(state.media) : media 
    })),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    resetChats: () => set({ 
        media: [], 
        text: "",
        userChatsIdsToDelete: [] 
    }),

    resetChatState: () => set({
        media: [], 
        receiverId: "",
        showUserProfile: false,
        text: "", 
        userChatsIdsToDelete: []
    }),

    showUserMedia: false,
    setShowUserMedia: (showUserMedia) => set({ showUserMedia }),

    showUserProfile: false,
    setShowUserProfile: (showUserProfile) => set({ showUserProfile }),

    text: "",
    setText: (text) => set({ text }),

    userChatsIdsToDelete: [],
    setUserChatsIdsToDelete: (userChatsIdsToDelete) => set((state) => ({
        userChatsIdsToDelete: typeof userChatsIdsToDelete === 'function' ? 
        userChatsIdsToDelete(state.userChatsIdsToDelete) : userChatsIdsToDelete
    })),
}));