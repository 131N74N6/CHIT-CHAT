import { create } from "zustand";

export interface NavbarState {
    navbarOpen: boolean;
    resetNavbarState: () => void;
    setNavbarOpen: (navbarOpen: boolean) => void;
}
export const useNavbarStore = create<NavbarState>((set) => ({
    navbarOpen: false,
    resetNavbarState: () => set({ navbarOpen: false }),
    setNavbarOpen: (navbarOpen) => set({ navbarOpen }),
}));