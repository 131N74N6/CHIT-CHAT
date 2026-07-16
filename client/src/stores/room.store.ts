import { create } from "zustand";

export interface RoomState {
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
    
    roomName: string;
    setRoomName: (roomName: string) => void;
    
    selectedProfileRoom: File | null;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;

    selectedProfileRoomUrl: string | null;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;
    
    resetRoomState: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    description: "",
    setDescription: (description) => set({ description }),

    deleteRoomImage: null,
    setDeleteRoomImage: (deleteRoomImage) => set({ deleteRoomImage }),

    oldRoomPicture: null,
    setOldRoomPicture: (oldRoomPicture) => set({ oldRoomPicture }),

    roomName: "",
    setRoomName: (roomName: string) => set({ roomName }),

    selectedProfileRoom: null,
    setSelectedProfileRoom: (selectedProfileRoom) => set({ selectedProfileRoom }),

    selectedProfileRoomUrl: null,
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl) => set({ selectedProfileRoomUrl }),

    resetRoomState: () => set({
        deleteRoomImage: null,
        description: "",
        oldRoomPicture: null,
        roomName: "",
        selectedProfileRoom: null,
        selectedProfileRoomUrl: null,
    }),
}));