export interface ChatbotState {
    answer: string;
    setAnswer: (answer: string) => void;

    clearSelectedResults: () => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;
    
    question: string;
    setQuestion: (question: string) => void;
    
    selectedChatBotIds: string[];
    toggleSelect: (id: string) => void;
    
    resetChatBotState: () => void;
}