import { create } from "zustand";
import type { ChatbotState } from "./model";

export const useChatbotStore = create<ChatbotState>((set) => ({
    answer: "",
    setAnswer: (answer) => set({ answer }),
    
    resetChatBotState: () => set({
        answer: "",
        question: "",
        selectedChatBotIds: [],
    }),
    
    selectMode: false,
    setSelectMode: (selectMode) => set({ selectMode }),

    selectedChatBotIds: [],
    resetSelectedChatBotIds: () => set({ selectedChatBotIds: [] }),
    setSelectedChatBotIds: (id) => set((state) => ({
        selectedChatBotIds: state.selectedChatBotIds.includes(id) ?
        state.selectedChatBotIds.filter(chatBotId => chatBotId !== id) : [...state.selectedChatBotIds, id]
    })),

    question: "",
    setQuestion: (question) => set({ question }),
}));