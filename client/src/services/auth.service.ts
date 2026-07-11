import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useNavigate } from "react-router-dom";
import type { IAuthService } from "../models/user.model";

export default function AuthServices(props?: IAuthService) {
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

    const signInMt = useMutation({
        mutationFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/auths/signin`, {
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password.trim()
                    }),
                    credentials: "include",
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
        setEmail, setPassword, setUserName, signInMt, signOutMt, signUpMt
    }
}