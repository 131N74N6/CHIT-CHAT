export type AuthState = SignInState & SignUpState;

export interface SignUpState {
    emailForSignUp: string;
    setEmailForSignUp: (emailForSignUp: string) => void;

    passwordForSignUp: string;
    setPasswordForSignUp: (passwordForSignUp: string) => void;

    showPasswordForSignUp: boolean;
    setShowPasswordForSignUp: (showPasswordForSignUp: boolean) => void;

    resetSignUpState: () => void;

    userNameForSignUp: string;
    setUserNameForSignUp: (userNameForSignUp: string) => void;
}

export interface SignInState {
    emailForSignIn: string;
    setEmailForSignIn: (emailForSignIn: string) => void;

    passwordForSignIn: string;
    setPasswordForSignIn: (passwordForSignIn: string) => void;

    showPasswordForSignIn: boolean;
    setShowPasswordForSignIn: (showPasswordForSignIn: boolean) => void;

    resetSignInState: () => void;
}