import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import type { IChangeUser } from "../models/user.model";

export default function changeUserService(props?: IChangeUser) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const resetUserState = useUserStore((state) => state.resetUserState);
    
    const address = useUserStore((state) => state.address);
    const setAddress = useUserStore((state) => state.setAddress);
    
    const deleteProfilePicture = useUserStore((state) => state.deleteProfilePicture);
    const setDeleteProfilePicture = useUserStore((state) => state.setDeleteProfilePicture);

    const gender = useUserStore((state) => state.gender);
    const setGender = useUserStore((state) => state.setGender);

    const oldProfile = useUserStore((state) => state.oldProfile);
    const setOldProfilePicture = useUserStore((state) => state.setOldProfilePicture);

    const profilePicture = useUserStore((state) => state.profilePicture);
    const setProfilePicture = useUserStore((state) => state.setProfilePicture);

    const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);
    
    const changeUserMt = useMutation({
        mutationFn: async () => {
            try {
                const formData = new FormData();
                formData.append("address", address.trim());
                formData.append("gender", gender);
                formData.append("username", username.trim());
                if (profilePicture) formData.append("image", profilePicture);

                if (deleteProfilePicture && deleteProfilePicture.public_id) {
                    const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/rm-pict`, {
                        body: JSON.stringify({ old_image: deleteProfilePicture }),
                        credentials: "include",
                        method: "DELETE"
                    });

                    const response = await request.json();
                    if (!request.ok) throw new Error(response.message);
                    return response;
                }

                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/users/remake`, {
                    body: formData,
                    credentials: "include",
                    method: "PUT"
                });

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        onError: (error) => {
            props?.setMessage!(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === "string") {
                        return queryKey[0].startsWith(`all-users`) ||
                        queryKey[0].startsWith('current-user') ||
                        queryKey[0].startsWith(`room-profile`);
                    }
                    return false;
                }
            });
            resetUserState();
            navigate(`/profile`);
        }
    });

    const handleImagePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        setProfilePicture(file!);
        const previewUrl = URL.createObjectURL(file as Blob);
        setProfilePictureUrl(previewUrl);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const isChangeUserProcessing = changeUserMt.isPending;

    return { 
        address,
        deleteProfilePicture,
        fileInputRef, 
        gender,
        changeUserMt, 
        handleImagePreview,
        isChangeUserProcessing, 
        oldProfile,
        profilePicture,
        profilePictureUrl,
        setAddress,
        setDeleteProfilePicture,
        setGender,
        setOldProfilePicture,
        setProfilePictureUrl,
        setProfilePicture,
        setUserName,
        username
    }
}