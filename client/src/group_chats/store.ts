import { create } from "zustand";
import type { IGroupChatState } from "./model";
import { persist } from "zustand/middleware";

export const useGroupChatStore = create<IGroupChatState>()(persist((set) => ({
    chosenFiles: [],
    setChosenFiles: (chosenFile) => set((state) => ({
        chosenFiles: typeof chosenFile === "function" ? chosenFile(state.chosenFiles) : chosenFile
    })),

    chosenMessageFromGroup: null,
    setChosenMessageFromGroup: (chosenMessageFromGroup) => set({ chosenMessageFromGroup }),

    chosenMessageIdsFromGroup: [],
    resetChosenMessageIdsFromGroup: () => set({ chosenMessageIdsFromGroup: [] }),
    setChosenMessageIdsFromGroup: (chosenMessageIdFromGroup) => set((state) => ({
        chosenMessageIdsFromGroup: state.chosenMessageIdsFromGroup.includes(chosenMessageIdFromGroup) ?
        state.chosenMessageIdsFromGroup.filter(v => v !== chosenMessageIdFromGroup) : 
        [...state.chosenMessageIdsFromGroup, chosenMessageIdFromGroup]
    })),

    groupId: "",
    setGroupId: (groupId) => set({ groupId }),

    groupMessage: "",
    setGroupMessage: (groupMessage) => set({ groupMessage }),

    groupMessageId: "",
    setGroupMessageId: (groupMessageId) => set({ groupMessageId }),

    groupName: "",
    setGroupName: (groupName) => set({ groupName }),

    openPopUpOption: false,
    setOpenPopUpOption: (openPopUpOption) => set({ openPopUpOption }),


    removeOneFile: (filename) => set((state) => ({
        chosenFiles: state.chosenFiles.filter((chosenFile) => chosenFile.file_name !== filename)
    })),
    
    resetGroupMessageState: () => set({
        chosenFiles: [],
        chosenMessageFromGroup: null,
        chosenMessageIdsFromGroup: [],
        groupId: "",
        groupMessage: "",
        groupMessageId: "",
        groupName: "",
        openPopUpOption: false,
        selectMode: false,
        showGroupChatPopUp: false,
        showGroupChatFilesPopUp: false,
        showGroupChatFilePreviewPopUp: false,
    }),

    selectMode: false,
    setSelectMode: (selectMode) => set({ selectMode }),

    showGroupChatPopUp: false,
    setShowGroupChatPopUp: (showGroupChatPopUp) => set({ showGroupChatPopUp }),

    showGroupChatFilesPopUp: false,
    setShowGroupChatFilesPopUp: (showGroupChatFilesPopUp) => set({ showGroupChatFilesPopUp }),

    showGroupChatFilePreviewPopUp: false,
    setShowGroupChatFilePreviewPopUp: (showGroupChatFilePreviewPopUp: boolean) => set({ showGroupChatFilePreviewPopUp })
}), {
    name: "group_chats",
    partialize: (state: IGroupChatState) => ({ 
        groupId: state.groupId,
        groupMessageId: state.groupMessageId 
    })
}));