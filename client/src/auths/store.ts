import { create } from "zustand";
import type { StateCreator } from "zustand";
import type { AuthState, SignInState, SignUpState } from "./model";

const useSignInStore: StateCreator<SignInState> = (set) => ({
    emailForSignIn: "",
    setEmailForSignIn: (emailForSignIn: string) => set({ emailForSignIn }),

    passwordForSignIn: "",
    setPasswordForSignIn: (passwordForSignIn: string) => set({ passwordForSignIn }),

    showPasswordForSignIn: false,
    setShowPasswordForSignIn: (showPasswordForSignIn) => set({ showPasswordForSignIn }),

    resetSignInState: () => set({
        emailForSignIn: "", passwordForSignIn: "", showPasswordForSignIn: false
    })
});

const useSignUpStore: StateCreator<SignUpState> = (set) => ({
    emailForSignUp: "",
    setEmailForSignUp: (emailForSignUp: string) => set({ emailForSignUp }),

    passwordForSignUp: "",
    setPasswordForSignUp: (passwordForSignUp: string) => set({ passwordForSignUp }),

    showPasswordForSignUp: false,
    setShowPasswordForSignUp: (showPasswordForSignUp) => set({ showPasswordForSignUp }),

    userNameForSignUp: "",
    setUserNameForSignUp: (userNameForSignUp: string) => set({ userNameForSignUp }),

    resetSignUpState: () => set({
        emailForSignUp: "", passwordForSignUp: "", userNameForSignUp: "", showPasswordForSignUp: false
    }),
});

export const useAuthStore = create<AuthState>()((...set) => ({
    ...useSignInStore(...set),
    ...useSignUpStore(...set)
}));