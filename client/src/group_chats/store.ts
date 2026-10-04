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
        showFilePreviewForGroup: false,
        showFileThatSentToGroup: false,
    }),

    selectMode: false,
    setSelectMode: (selectMode) => set({ selectMode }),

    showFilePreviewForGroup: false,
    setFilePreviewForGroup: (showFilePreviewForGroup) => set({ showFilePreviewForGroup }),

    showFileThatSentToGroup: false,
    setFileThatSentToGroup: (showFileThatSentToGroup: boolean) => set({ showFileThatSentToGroup })
}), {
    name: "group_chats",
    partialize: (state: IGroupChatState) => ({ 
        groupId: state.groupId,
        groupMessageId: state.groupMessageId 
    })
}));