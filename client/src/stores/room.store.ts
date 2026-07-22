import { create } from "zustand";

export interface RoomState {
    clearChatsIdsSelection: () => void;

    deleteRoomImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setDeleteRoomImage: (deleteRoomImage: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    description: string;
    setDescription: (description: string) => void;
    
    isSelectMode: boolean;
    setIsSelectMode: (isSelectMode: boolean) => void;

    oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setOldRoomPicture: (oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    roomId: string;
    setRoomId: (roomId: string) => void;
    
    resetRoomState: () => void;

    roomName: string;
    setRoomName: (roomName: string) => void;

    selectedChatsIds: string[];
    
    selectedProfileRoom: File | null;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;

    selectedProfileRoomUrl: string | null;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;
    
    showDeleteOption1: boolean;
    setShowDeleteOption1: (showDeleteOption1: boolean) => void;
    
    showDeleteOption2: boolean;
    setShowDeleteOption2: (showDeleteOption2: boolean) => void;

    showMember: boolean;
    setShowMember: (showMember: boolean) => void;

    showProfile: boolean;
    setShowProfile: (showProfile: boolean) => void;

    toggleSelect: (id: string) => void;
    
    userChatsIdsToDelete: string[];
    setUserChatsIdsToDelete: (userChatsIdsToDelete: string[] | ((prev: string[]) => string[])) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    clearChatsIdsSelection: () => set({ selectedChatsIds: [] }),

    deleteRoomImage: null,
    setDeleteRoomImage: (deleteRoomImage) => set({ deleteRoomImage }),

    description: "",
    setDescription: (description) => set({ description }),
    
    isSelectMode: false,
    setIsSelectMode: (isSelectMode) => set({ isSelectMode }),

    oldRoomPicture: null,
    setOldRoomPicture: (oldRoomPicture) => set({ oldRoomPicture }),
    
    resetRoomState: () => set({
        deleteRoomImage: null,
        description: "",
        isSelectMode: false,
        oldRoomPicture: null,
        roomName: "",
        selectedChatsIds: [],
        selectedProfileRoom: null,
        selectedProfileRoomUrl: null,
        showDeleteOption1: false,
        showDeleteOption2: false,
        userChatsIdsToDelete: []
    }),

    roomId: "",
    setRoomId: (roomId) => set({ roomId }),

    roomName: "",
    setRoomName: (roomName: string) => set({ roomName }),

    selectedChatsIds: [],

    selectedProfileRoom: null,
    setSelectedProfileRoom: (selectedProfileRoom) => set({ selectedProfileRoom }),

    selectedProfileRoomUrl: null,
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl) => set({ selectedProfileRoomUrl }),

    showDeleteOption1: false,
    setShowDeleteOption1: (showDeleteOption1) => set({ showDeleteOption1 }),

    showDeleteOption2: false,
    setShowDeleteOption2: (showDeleteOption2) => set({ showDeleteOption2 }),

    showMember: false,
    setShowMember: (showMember) => set({ showMember }),

    showProfile: false,
    setShowProfile: (showProfile) => set({ showProfile }),

    toggleSelect: (id) => set((state) => ({
        selectedChatsIds: state.selectedChatsIds.includes(id) ?
        state.selectedChatsIds.filter(chatId => chatId !== id) : [...state.selectedChatsIds, id]
    })),

    userChatsIdsToDelete: [],
    setUserChatsIdsToDelete: (userChatsIdsToDelete) => set((state) => ({
        userChatsIdsToDelete: typeof userChatsIdsToDelete === 'function' ?
        userChatsIdsToDelete(state.userChatsIdsToDelete) : userChatsIdsToDelete
    })),
}));