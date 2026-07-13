import { create } from "zustand";

export interface ChatbotState {
    question: string;
    setQuestion: (question: string) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
    question: "",
    setQuestion: (question) => set({ question }),
}));