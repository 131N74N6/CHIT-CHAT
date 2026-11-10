import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../alert/store";
import { useUserStore } from "./store";

export default function useUserSSEClient(
    mergeCurrentUser: (old: any, incoming: any) => any,
    patchAllUsers: (userId: string, patch: Record<string, any>) => void,
    receiverIdRef: React.RefObject<string>,
    removeAllUsers: (userId: string) => void
) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const setMessage = useMessageStore((state) => state.setMessage);
    const currentUserId = useUserStore((state) => state.currentUserId);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);
    
    useEffect(() => {
        if (!currentUserId) return;

        const baseUrl = (import.meta.env.VITE_BASE_API_URL ?? "").replace(/\/$/, "");
        const es = new EventSource(`${baseUrl}/api/v1/users/sse`, { withCredentials: true });

        const parseEvent = (event: MessageEvent) => {
            try {
                return JSON.parse(event.data);
            } catch {
                return null;
            }
        };

        const onConnected = (event: MessageEvent) => {
            const data = parseEvent(event);
            if (data?.message) setMessage(data.message);
        }

        const onAuthError = (event: MessageEvent) => {
            const data = parseEvent(event);
            setMessage(data?.message ?? "authentication failed");
            es.close();
            navigate("/sign-in");
        }

        const onCurrentProfileChanged = (event: MessageEvent) => {
            const data = parseEvent(event);
            if (!data) return;

            queryClient.setQueryData(["current-user"], (old: any) => mergeCurrentUser(old, data));
        }

        const onAvailableUserChanged = (event: MessageEvent) => {
            const data = parseEvent(event);
            if (!data?._id) return;

            patchAllUsers(data._id, {
                name: data.name,
                image: data.image,
                image_public_id: data.image_public_id,
            });

            if (receiverIdRef.current === data._id) {
                queryClient.setQueryData([`other-user-${receiverIdRef.current}`],
                    (old: any) => old ? {
                        ...old,
                        name: data.name,
                        image: data.image,
                        image_public_id: data.image_public_id,
                    } : data
                );
            }
        }

        const onAvailableUserDeleted = (event: MessageEvent) => {
            const data = parseEvent(event);
            const userId = typeof data === "string" ? data : data?.user_id;

            if (typeof userId === "string") removeAllUsers(userId);
        }

        const onCurrentProfileDeleted = () => {
            queryClient.setQueryData(["current-user"], null);
        }

        const onCurrentProfilePictureDeleted = (event: MessageEvent) => {
            const data = parseEvent(event);
            if (!data) return;

            queryClient.setQueryData(["current-user"], (old: any) => mergeCurrentUser(old, data));

            setProfilePictureUrl(data.profile_picture?.url ?? null);
        }

        const onAvailableProfilePictureDeleted = (event: MessageEvent) => {
            const data = parseEvent(event);
            if (!data?._id) return;

            patchAllUsers(data._id, {
                image: data.image,
                image_public_id: data.image_public_id,
            });

            if (receiverIdRef.current === data._id) {
                queryClient.setQueryData([`other-user-${receiverIdRef.current}`],
                    (old: any) => old ? {
                        ...old,
                        image: data.image,
                        image_public_id: data.image_public_id,
                    } : old
                );
            }
        }

        es.addEventListener("connected", onConnected);
        es.addEventListener("auth-error", onAuthError);
        es.addEventListener("current-user-profile:changed", onCurrentProfileChanged);
        es.addEventListener("available-user:changed", onAvailableUserChanged);
        es.addEventListener("available-user:deleted", onAvailableUserDeleted);
        es.addEventListener("current-user-profile:deleted", onCurrentProfileDeleted);
        es.addEventListener("current-user-profile-picture:deleted", onCurrentProfilePictureDeleted);
        es.addEventListener("available-user-profile-picture:deleted", onAvailableProfilePictureDeleted);

        es.onerror = () => {
            if (es.readyState === EventSource.CLOSED) {
                setMessage("profile realtime connection closed");
            }
        };

        return () => {
            es.removeEventListener("connected", onConnected);
            es.removeEventListener("auth-error", onAuthError);
            es.removeEventListener("current-user-profile:changed", onCurrentProfileChanged);
            es.removeEventListener("available-user:changed", onAvailableUserChanged);
            es.removeEventListener("available-user:deleted", onAvailableUserDeleted);
            es.removeEventListener("current-user-profile:deleted", onCurrentProfileDeleted);
            es.removeEventListener("current-user-profile-picture:deleted", onCurrentProfilePictureDeleted);
            es.removeEventListener("available-user-profile-picture:deleted", onAvailableProfilePictureDeleted);
            es.close();
        }
    }, [
        currentUserId,
        queryClient,
        setMessage,
        navigate,
        mergeCurrentUser,
        patchAllUsers,
        removeAllUsers,
        setProfilePictureUrl,
    ]);
}