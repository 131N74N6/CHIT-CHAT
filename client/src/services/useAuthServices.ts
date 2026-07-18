import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useNavigate } from "react-router-dom";
import type { IAuthService } from "../models/user.model";
import { useRoomStore } from "../stores/room.store";
import { useChatStore } from "../stores/chat.store";

export default function useAuthServices(props?: IAuthService) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const email = useUserStore((state) => state.email);
    const setEmail = useUserStore((state) => state.setEmail);

    const password = useUserStore((state) => state.password);
    const setPassword = useUserStore((state) => state.setPassword);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);
    
    const resetSignIn = useUserStore((state) => state.resetSignIn);
    const resetSignUp = useUserStore((state) => state.resetSignUp);

    const resetRoomState = useRoomStore((state) => state.resetRoomState);
    const resetChatState = useChatStore((state) => state.resetChatState);

    const signInMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/signin`, {
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password.trim()
                    }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (response) => {
            props?.setMessage!(response.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["current-user"] });
            navigate("/home");
            resetSignIn();
        }
    });

    const signOutMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/signout`, {
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (response) => {
            props?.setMessage!(response.message);
        },
        onSuccess: () => {
            queryClient.setQueryData(['current-user'], null);
            queryClient.clear();
            resetChatState();
            resetRoomState();
            navigate("/sign-in");
        }
    });

    const signUpMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/signup`, {
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password.trim(),
                        username: username.trim()
                    }),
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    method: "POST"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (response) => {
            props?.setMessage!(response.message);
        },
        onSuccess: () => {
            navigate("/sign-in");
            resetSignUp();
        }
    });

    return {
        email, password, setEmail, setPassword, setUserName, signInMt, signOutMt, signUpMt, username
    }
}