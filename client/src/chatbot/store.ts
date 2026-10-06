import { create } from "zustand";
import type { ChatbotState } from "./model";

export const useChatbotStore = create<ChatbotState>((set) => ({
    answer: "",
    setAnswer: (answer) => set({ answer }),
    
    clearChatBotState: () => set({
        question: "",
        selectedChatBotIds: [],
    }),

    clearSelectedResults: () => set({
        selectedChatBotIds: []
    }),
    
    isSelectMode: false,
    setIsSelectMode: (isSelectMode) => set({ isSelectMode }),

    question: "",
    setQuestion: (question) => set({ question }),

    selectedChatBotIds: [],

    toggleSelect: (id) => set((state) => ({
        selectedChatBotIds: state.selectedChatBotIds.includes(id) ?
        state.selectedChatBotIds.filter(chatBotId => chatBotId !== id) : [...state.selectedChatBotIds, id]
    }))
}));