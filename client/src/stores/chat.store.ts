import { create } from "zustand";
import type { IFileViewer } from "../models/chat.model";

export interface ChatState {
    clearSelection: () => void;

    media: IFileViewer[];
    setMedia: (media: IFileViewer[] | ((prev: IFileViewer[]) => IFileViewer[])) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    resetChatState: () => void;

    selectedIds: string[];
    
    showUserMedia: boolean;
    setShowUserMedia: (showUserMedia: boolean) => void;
    
    showDeleteOption: boolean;
    setShowDeleteOption: (showDeleteOption: boolean) => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    
    showUserProfile: boolean;
    setShowUserProfile: (showUserProfile: boolean) => void;
    
    text: string;
    setText: (text: string) => void;

    toggleSelect: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    clearSelection: () => set({ selectedIds: [] }),

    media: [],
    setMedia: (media) => set((state) => ({ 
        media: typeof media === 'function' ? media(state.media) : media 
    })),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    resetChatState: () => set({
        isSelectMode: false,
        media: [], 
        receiverId: "",
        selectedIds: [],
        showUserProfile: false,
        text: "", 
        showDeleteOption: false,
    }),

    selectedIds: [],

    showUserMedia: false,
    setShowUserMedia: (showUserMedia) => set({ showUserMedia }),

    showDeleteOption: false,
    setShowDeleteOption: (showDeleteOption) => set({ showDeleteOption }),
    
    isSelectMode: false,
    setIsSelectMode: (isSelectMode) => set({ isSelectMode }),

    showUserProfile: false,
    setShowUserProfile: (showUserProfile) => set({ showUserProfile }),

    text: "",
    setText: (text) => set({ text }),

    toggleSelect: (id) => set((state) => ({
        selectedIds: state.selectedIds.includes(id) ? 
        state.selectedIds.filter(itemId => itemId !== id) : [...state.selectedIds, id]
    })),
}));