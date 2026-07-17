import { create } from "zustand";

export interface ChatbotState {
    answer: string;
    setAnswer: (answer: string) => void;

    question: string;
    setQuestion: (question: string) => void;
}

export const useChatbotStore = create<ChatbotState>((set) => ({
    answer: "",
    setAnswer: (answer) => set({ answer }),

    question: "",
    setQuestion: (question) => set({ question }),
}));