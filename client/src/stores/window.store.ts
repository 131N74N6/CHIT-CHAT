import { create } from "zustand";

export interface WindowState {
    profilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setProfilePicture: (profilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    receiverId: string;
    setReceiverId: (receiverId: string) => void;

    roomId: string;
    setRoomId: (roomId: string) => void;

    roomName: string;
    setRoomName: (roomName: string) => void;
    
    roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setRoomProfilePicture: (roomProfilePicture: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    username: string;
    setUserName: (username: string) => void;
}

export const useWindowStore = create<WindowState>((set) => ({
    profilePicture: null,
    setProfilePicture: (profilePicture) => set({ profilePicture }),

    receiverId: "",
    setReceiverId: (receiverId) => set({ receiverId }),

    roomName: "",
    setRoomName: (roomName) => set({ roomName }),

    roomId: "",
    setRoomId: (roomId) => set({ roomId }),

    roomProfilePicture: null,
    setRoomProfilePicture: (roomProfilePicture) => set({ roomProfilePicture }),

    username: "",
    setUserName: (username) => set({ username })
}));