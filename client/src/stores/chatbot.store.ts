import { create } from "zustand";

export interface ChatbotState {
    answer: string;
    setAnswer: (answer: string) => void;

    clearChatBotState: () => void;
    clearSelectedResults: () => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;

    question: string;
    setQuestion: (question: string) => void;

    selectedChatBotIds: string[];

    toggleSelect: (id: string) => void;
}

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