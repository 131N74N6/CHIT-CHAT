import { create } from "zustand";
import type { IFileViewer } from "../models/chat.model";

export interface ChatState {
    chatId: string;
    setChatId: (chatId: string) => void;

    clearSelection: () => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;

    media: IFileViewer[];
    setMedia: (media: IFileViewer[] | ((prev: IFileViewer[]) => IFileViewer[])) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    resetChatState: () => void;

    remove: (fileName: string) => void;

    selectedIds: string[];
    
    showSentUserMedia: boolean;
    setShowSentUserMedia: (showSentUserMedia: boolean) => void;
    
    showUserMedia: boolean;
    setShowUserMedia: (showUserMedia: boolean) => void;
    
    showDeleteOption1: boolean;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    
    showDeleteOption2: boolean;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;
    
    showUserProfile: boolean;
    setShowUserProfile: (showUserProfile: boolean) => void;
    
    text: string;
    setText: (text: string) => void;

    toggleSelect: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    chatId: getUserChatIdFromLocalStorage(),
    setChatId: (chatId) => {
        localStorage.setItem("chat_id", chatId);
        set({ chatId });
    },

    clearSelection: () => set({ selectedIds: [] }),
    
    isSelectMode: false,
    setIsSelectMode: (isSelectMode) => set({ isSelectMode }),

    media: [],
    setMedia: (media) => set((state) => ({ 
        media: typeof media === 'function' ? media(state.media) : media 
    })),

    receiverId: getReceiverIdFromLocalStorage(),
    setReceiverId: (receiverId) => {
        localStorage.setItem("receiver_id", receiverId);
        set({ receiverId });
    },

    remove: (fileName) => set((state) => ({
        media: state.media.filter(media => media.fileName !== fileName)
    })),

    resetChatState: () => {
        localStorage.removeItem("chat_id");
        localStorage.removeItem("receiver_id");
        set({
            chatId: "",
            isSelectMode: false,
            media: [], 
            receiverId: "",
            selectedIds: [],
            showSentUserMedia: false,
            showUserMedia: false,
            showUserProfile: false,
            text: "", 
            showDeleteOption1: false,
            showDeleteOption2: false,
        })
    },

    selectedIds: [],

    showSentUserMedia: false,
    setShowSentUserMedia: (showSentUserMedia) => set({ showSentUserMedia }),

    showUserMedia: false,
    setShowUserMedia: (showUserMedia) => set({ showUserMedia }),

    showDeleteOption1: false,
    setShowDeleteOption1: (showDeleteOption1) => set({ showDeleteOption1 }),

    showDeleteOption2: false,
    setShowDeleteOption2: (showDeleteOption2) => set({ showDeleteOption2 }),

    showUserProfile: false,
    setShowUserProfile: (showUserProfile) => set({ showUserProfile }),

    text: "",
    setText: (text) => set({ text }),

    toggleSelect: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id) ? 
        state.selectedIds.filter(itemId => itemId !== id) : [...state.selectedIds, id]
    })),
}));

function getReceiverIdFromLocalStorage(): string {
    return localStorage.getItem("receiver_id") || "";
}

function getUserChatIdFromLocalStorage(): string {
    return localStorage.getItem("chat_id") || "";
}