import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../stores/room.store";
import { useChatStore } from "../user_chats/store";
import { useNavbarStore } from "../stores/navbar.store";
import { useChatbotStore } from "../stores/chatbot.store";
import { useMessageStore } from "../stores/message.store";
import { createAuthClient } from "better-auth/client";
import type { AuthServiceApi } from "../../../api/src/auth/model";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { useAuthStore } from "./store";
import { useEffect } from "react";
import { useUserStore } from "../user_profiles/store";

export default function useAuthService() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const setMessage = useMessageStore((state) => state.setMessage);

    const emailForSignUp = useAuthStore((state) => state.emailForSignUp);
    const emailForSignIn = useAuthStore((state) => state.emailForSignIn);

    const passwordForSignUp = useAuthStore((state) => state.passwordForSignUp);
    const passwordForSignIn = useAuthStore((state) => state.passwordForSignIn);

    const userNameForSignUp = useAuthStore((state) => state.userNameForSignUp);
    
    const resetSignInState = useAuthStore((state) => state.resetSignInState);
    const resetSignUpState = useAuthStore((state) => state.resetSignUpState);

    const resetRoomState = useRoomStore((state) => state.resetRoomState);
    const resetChatState = useChatStore((state) => state.resetChatState);
    const clearChatBotState = useChatbotStore((state) => state.clearChatBotState);
    
    const resetNavbarState = useNavbarStore((state) => state.resetNavbarState);
    const setCurrentUserId = useUserStore((state) => state.setCurrentUserId);

    const authServiceClient = createAuthClient({
        baseURL: import.meta.env.VITE_BASE_API_URL,
        plugins: [inferAdditionalFields<AuthServiceApi>()],
        fetchOptions: {
            credentials: "include"
        }
    });

    const getCurrentUser = useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const request = await authServiceClient.getSession();
            if (request.error || !request.data) return null;

            return { 
                created_at: request.data.user.createdAt,
                description: request.data.user.description,
                email: request.data.user.email, 
                profile_picture: {
                    public_id: request.data.user.image_public_id,
                    url: request.data.user.image,
                },
                user_id: request.data.user.id,
                user_name: request.data.user.name,
                user_session: request.data.session
            }
        },
        
        retry: false
    });

    useEffect(() => {
        if (getCurrentUser.data && getCurrentUser.data.user_id) {
            setCurrentUserId(getCurrentUser.data.user_id);
        }
    }, [getCurrentUser.data?.user_id, setCurrentUserId]);

    const signInMt = useMutation({
        mutationFn: async () => {
            const request = await authServiceClient.signIn.email({
                email: emailForSignIn.trim(),
                password: passwordForSignIn.trim()
            });

            if (request.error) throw new Error(request.error.message);
            return request.data.user;
        },
        onError: (error) => {
            const errorMessage = parseAuthError(error);
            setMessage(errorMessage);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["current-user"] });
            navigate("/home");
            resetSignInState();
        }
    });

    const signOutMt = useMutation({
        mutationFn: async () => {
            const request = await authServiceClient.signOut();
            if (request.error) throw new Error(request.error.message);
            return request.data;
        },
        onError: (error) => {
            const errorMessage = parseAuthError(error);
            setMessage(errorMessage);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            resetSignInState();
            resetSignUpState();
            clearChatBotState();
            resetChatState();
            resetRoomState();
            resetNavbarState();
            useUserStore.persist.clearStorage();
            navigate("/sign-in");
        }
    });

    const signUpMt = useMutation({
        mutationFn: async () => {
            const request = await authServiceClient.signUp.email({
                email: emailForSignUp.trim(),
                name: userNameForSignUp.trim(),
                password: passwordForSignUp.trim()
            });

            if (request.error) throw new Error(request.error.message);
            return request.data.user;
        },
        onError: (error) => {
            const errorMessage = parseAuthError(error);
            setMessage(errorMessage);
        },
        onSuccess: () => {
            navigate("/sign-in");
            resetSignUpState();
        }
    });

    function parseAuthError(error: any): string {
        const message = error.message || "";
        
        if (message.includes("Invalid email address")) return "invalid email";
        
        if (message.includes("Too small: expected string to have >=1 characters")) {
            if (message.includes("password")) return "Password is required";
            if (message.includes("email")) return "Email is required";
        }

        if (message.includes("password") && message.includes("minPasswordLength")) {
            return "Password length must be 8 character";
        }

        if (message.includes("email") && message.includes("already exists")) {
            return "Email already exist";
        }
        
        return message || "something went wrong. try again later";
    }

    const isProcessing = [signInMt, signOutMt, signUpMt].some((p) => p.isPending);

    return { getCurrentUser, isProcessing, signInMt, signOutMt, signUpMt }
}