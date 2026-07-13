import { create } from "zustand";

export interface RoomState {
    description: string;
    oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    roomName: string;
    selectedProfileRoom: File | null;
    selectedProfileRoomUrl: string | null;

    resetRoomState: () => void;

    setDescription: (description: string) => void;
    setOldRoomPicture: (oldRoomPicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;
    setRoomName: (roomName: string) => void;
    setSelectedProfileRoom: (selectedProfileRoom: File | null) => void;
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl: string | null) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
    description: "",
    oldRoomPicture: null,
    roomName: "",
    selectedProfileRoom: null,
    selectedProfileRoomUrl: null,

    resetRoomState: () => set({
        description: "",
        oldRoomPicture: null,
        roomName: "",
        selectedProfileRoom: null,
        selectedProfileRoomUrl: null,
    }),

    setDescription: (description) => set({ description }),
    setOldRoomPicture: (oldRoomPicture) => set({ oldRoomPicture }),
    setRoomName: (roomName: string) => set({ roomName }),
    setSelectedProfileRoom: (selectedProfileRoom) => set({ selectedProfileRoom }),
    setSelectedProfileRoomUrl: (selectedProfileRoomUrl) => set({ selectedProfileRoomUrl }),
}));