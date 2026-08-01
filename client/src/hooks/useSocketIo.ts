import { useEffect } from "react";
import useSocketIoService from "../services/useSocketIoService";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useChatStore } from "../stores/chat.store";
import { useRoomStore } from "../stores/room.store";

interface ChatSocketIntrf {
    identifier: string[];
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();
    const currentUserId = useUserStore((state) => state.currentUserId);
    const currentUserRoomIds = useUserStore((state) => state.currentUserRoomIds);
    const receiverId = useChatStore((state) => state.receiverId);
    const roomId = useRoomStore((state) => state.roomId);

    const {
        connect,
        getSocket,
        onAvailableRoomJoin,
        onAvailableUserJoin,
        onChangeRoom,
        onChangeUser,
        onDeleteAllChatsInRoom,
        onDeleteChatInRoom,
        onDeleteAllChats,
        onDeleteChat,
        onDeleteRoom,
        onDeleteUser,
        onJoinNewMember,
        onKickMember,
        onLeftTheRoom,
        onUserChatJoin,
        onUserProfileJoin,
        onRoomChatJoin,
        onRoomMemberJoin,
        onRoomProfileJoin,
        onSendToRoom,
        onSendToUser
    } = useSocketIoService();

    useEffect(() => {
        if (!currentUserId) return;
        connect(currentUserId);

        if (props.identifier.includes("available-room")) {
            onAvailableRoomJoin(currentUserId);
        } else if (props.identifier.includes("available-user")) {
            onAvailableUserJoin(currentUserId);
        } else if (props.identifier.includes("room-chat") && roomId !== "") {
            onRoomChatJoin(roomId);
        } else if (props.identifier.includes("room-member") && roomId !== "") {
            onRoomMemberJoin(roomId);
        } else if (props.identifier.includes("room-profile") && roomId !== "") {
            onRoomProfileJoin(roomId);
        } else if (props.identifier.includes("user-chat")) {
            onUserChatJoin(currentUserId);
        } else {
            onUserProfileJoin(receiverId!);
        }

        if (props.identifier.includes("user-profile")) {
            onUserProfileJoin(currentUserId);
            
            if (receiverId && receiverId !== "") {
                onUserProfileJoin(receiverId);
            }
        }

        const socket = getSocket();

        const changeRoomValidations = () => {
            queryClient.invalidateQueries({ queryKey: [`room-profile-${roomId}`] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
        }

        const deleteRoomValidations = () => {
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-profile-${roomId}`] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
        }

        const changeUserValidations = () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });

            if (receiverId) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${receiverId}`] });
            }

            if (currentUserId) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${currentUserId}`] });
            }

            if (currentUserRoomIds && currentUserRoomIds.length > 0) {
                currentUserRoomIds.forEach((currentUserRoomId) => {
                    queryClient.invalidateQueries({ queryKey: [`room-chat-${currentUserRoomId}`] });
                    queryClient.invalidateQueries({ queryKey: [`room-member-${currentUserRoomId}`] });
                });
            }
        }


        const deleteUserValidations = () => {
            queryClient.invalidateQueries({ queryKey: ['all-users'] });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });

            if (receiverId) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${receiverId}`] });
            }

            if (currentUserId) {
                queryClient.invalidateQueries({ queryKey: [`receiver-${currentUserId}`] });
            }

            if (currentUserRoomIds && currentUserRoomIds.length > 0) {
                currentUserRoomIds.forEach((currentUserRoomId) => {
                    queryClient.invalidateQueries({ queryKey: [`room-chat-${currentUserRoomId}`] });
                    queryClient.invalidateQueries({ queryKey: [`room-member-${currentUserRoomId}`] });
                });
            }
        }

        const joinRoomValidations = () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomId}`] });
        }

        const kickMemberFromRoomValidations = () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomId}`] });
        }

        const leftRoomValidations = () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: [`available-room-${currentUserId}`] });
            queryClient.invalidateQueries({ queryKey: [`room-member-${roomId}`] });
        }
        
        const roomChatValidations = () => {
            queryClient.invalidateQueries({ queryKey: [`room-chat-${roomId}`] });
        }


        const userChatValidations = () => {
            queryClient.invalidateQueries({ queryKey: [`user-chat-${receiverId}`] });
        }

        if (props.identifier.includes("available-rooms")) {
            onChangeRoom(() => changeRoomValidations());
            onDeleteRoom(() => deleteRoomValidations());
        }

        if (props.identifier.includes("available-users")) {
            onChangeUser(() => changeUserValidations());
            onDeleteUser(() => deleteUserValidations());
        }

        if (props.identifier.includes("room-chat")) {
            onChangeRoom(() => changeRoomValidations());
            onDeleteAllChatsInRoom(() => roomChatValidations());
            onDeleteChatInRoom(() => roomChatValidations());
            onSendToRoom(() => roomChatValidations());
        }

        if (props.identifier.includes("room-member")) {
            onChangeUser(() => changeUserValidations());
            onDeleteRoom(() => deleteRoomValidations());
            onDeleteUser(() => deleteUserValidations());
            onJoinNewMember(() => joinRoomValidations());
            onKickMember(() => kickMemberFromRoomValidations());
            onLeftTheRoom(() => leftRoomValidations());
        }

        if (props.identifier.includes("room-profile")) {
            onChangeRoom(() => changeRoomValidations());
            onDeleteRoom(() => deleteRoomValidations());
        }

        if (props.identifier.includes("user-chat")) {
            onChangeUser(() => changeUserValidations());
            onDeleteAllChats(() => userChatValidations());
            onDeleteChat(() => userChatValidations());
            onDeleteUser(() => deleteUserValidations());
            onSendToUser(() => userChatValidations());
        }

        if (props.identifier.includes("user-profile")) {
            onChangeUser(() => changeUserValidations());
            onDeleteUser(() => deleteUserValidations());
        }

        return () => {
            if (socket) {
                socket.off("room-chat:send-new-chat", () => roomChatValidations());
                socket.off("room-chat:all-deleted", () => roomChatValidations());
                socket.off("room-chat:deleted", () => roomChatValidations());
                socket.off("room-profile:changed", () => changeRoomValidations());
                socket.off("room:deleted", () => deleteRoomValidations());
                socket.off("room:member-kicked", () => kickMemberFromRoomValidations());
                socket.off("user-chat:send-new-chat", () => userChatValidations());
                socket.off("user-chat:all-deleted", () => userChatValidations());
                socket.off("user-chat:deleted", () => userChatValidations());
                socket.off("user-profile:changed", () => changeUserValidations());
                socket.off("user:deleted", () => deleteUserValidations());
                socket.off("user:join-room-successfully", () => joinRoomValidations());
                socket.off("user:left-room-successfully", () => leftRoomValidations());
            }
        }
        
    }, [props.identifier, currentUserId, roomId, receiverId, queryClient]);
}