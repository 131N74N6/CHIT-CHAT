import { create } from "zustand";

export interface NavbarState {
    navbarOpen: boolean;
    setNavbarOpen: (navbarOpen: boolean) => void;
}
export const useNavbarStore = create<NavbarState>((set) => ({
    navbarOpen: false,
    setNavbarOpen: (navbarOpen) => set({ navbarOpen }),
}));