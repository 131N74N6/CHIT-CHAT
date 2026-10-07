import { create } from "zustand";
import type { IUserChatState } from "./model";
import { persist } from "zustand/middleware";

export const useUserChatStore = create<IUserChatState>()(persist((set) => ({
    chosenFiles: [],
    setChosenFiles: (chosenFile) => set((state) => ({ 
        chosenFiles: typeof chosenFile === 'function' ? chosenFile(state.chosenFiles) : chosenFile 
    })),

    chosenMessage: null,
    setChosenMessage: (chosenMessage) => set({ chosenMessage }),

    chosenMessageId: "",
    setChosenMessageId: (chosenMessageId) => set({ chosenMessageId }),

    chosenMessageIds: [],
    resetChosenMessageIds: () => set({ chosenMessageIds: [] }),
    setChosenMessageIds: (messageId: string) => set((state) => ({
        chosenMessageIds: state.chosenMessageIds.includes(messageId) ?
        state.chosenMessageIds.filter(chosenMessageId => chosenMessageId !== messageId) : 
        [...state.chosenMessageIds, messageId]
    })),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    resetChatState: () => {
        set({
            chosenMessage: null,
            chosenMessageId: "",
            chosenMessageIds: [],
            selectMode: false,
            chosenFiles: [], 
            receiverId: "",
            showUserChatFilesPopUp: false,
            showUserMedia: false,
            showUserChatPopUp: false,
            text: "", 
            openPopUpOption: false
        })
    },

    openPopUpOption: false,
    setOpenPopUpOption: (openPopUpOption) => set({ openPopUpOption }),
    
    selectMode: false,
    setSelectMode: (selectMode) => set({ selectMode }),

    showUserChatFilesPopUp: false,
    setShowUserChatFilesPopUp: (showUserChatFilesPopUp) => set({ showUserChatFilesPopUp }),

    showUserMedia: false,
    setShowUserMedia: (showUserMedia) => set({ showUserMedia }),

    showUserChatPopUp: false,
    setShowUserChatPopUp: (showUserChatPopUp) => set({ showUserChatPopUp }),

    text: "",
    setText: (text) => set({ text }),
}), {
    name: "user_chats",
    partialize: (state) => ({ 
        chosenMessageId: state.chosenMessageId,
        receiverId: state.receiverId
    })}
));