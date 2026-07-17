import { create } from "zustand";

export interface RoomState {
    createdAt: string;
    setCreatedAt: (createdAt: string) => void;

    description: string;
    setDescription: (description: string) => void;

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
    
    roomName: string;
    setRoomName: (roomName: string) => void;
    
    selectedProfileRoom: File | null;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;

    selectedProfileRoomUrl: string | null;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;

    showMember: boolean;
    setShowMember: (showMember: boolean) => void;

    showProfile: boolean;
    setShowProfile: (showProfile: boolean) => void;
    
    resetRoomState: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    createdAt: "",
    setCreatedAt: (createdAt) => set({ createdAt }),

    description: "",
    setDescription: (description) => set({ description }),

    deleteRoomImage: null,
    setDeleteRoomImage: (deleteRoomImage) => set({ deleteRoomImage }),

    oldRoomPicture: null,
    setOldRoomPicture: (oldRoomPicture) => set({ oldRoomPicture }),
    
    roomId: "",
    setRoomId: (roomId) => set({ roomId }),

    roomName: "",
    setRoomName: (roomName: string) => set({ roomName }),

    selectedProfileRoom: null,
    setSelectedProfileRoom: (selectedProfileRoom) => set({ selectedProfileRoom }),

    selectedProfileRoomUrl: null,
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl) => set({ selectedProfileRoomUrl }),

    showMember: false,
    setShowMember: (showMember) => set({ showMember }),

    showProfile: false,
    setShowProfile: (showProfile) => set({ showProfile }),

    resetRoomState: () => set({
        deleteRoomImage: null,
        description: "",
        oldRoomPicture: null,
        roomName: "",
        selectedProfileRoom: null,
        selectedProfileRoomUrl: null,
    }),
}));