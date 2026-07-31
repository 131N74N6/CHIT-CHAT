import { useEffect } from "react";
import useSocketIoService from "../services/useSocketIoService";
import { Query, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../stores/user.store";
import { useChatStore } from "../stores/chat.store";
import { useRoomStore } from "../stores/room.store";

interface ChatSocketIntrf {
    currentUserId: string;
    identifier: string[];
    marks?: { receiverId?: string; roomId?: string };
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();
    const currentUserId = useUserStore((state) => state.currentUserId);
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
        } else if (props.identifier.includes("room-chat")) {
            onRoomChatJoin(roomId);
        } else if (props.identifier.includes("room-member")) {
            onRoomMemberJoin(roomId);
        } else if (props.identifier.includes("room-profile")) {
            onRoomProfileJoin(roomId);
        } else if (props.identifier.includes("user-chat")) {
            onUserChatJoin(currentUserId);
        } else {
            onUserProfileJoin(receiverId!);
        }

        if (props.identifier.includes("user-profile")) {
            onUserProfileJoin(currentUserId);
            
            if (receiverId) {
                onUserProfileJoin(receiverId);
            }
        }

        const socket = getSocket();

        function invalidations(queryNames: string[]) {
            queryClient.invalidateQueries({
                predicate: (query: Query<unknown, Error, unknown, readonly unknown[]>) => {
                    const queryKey = query.queryKey;
                    if (Array.isArray(queryKey) && queryKey.length > 0 && typeof queryKey[0] === 'string') {
                        return queryNames.some(queryName => queryKey[0].startsWith(queryName));
                    }
                    return false;
                }
            });
        }

        if (props.identifier.includes("available-rooms")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
        }

        if (props.identifier.includes("available-users")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "receiver", "room-member"]));
            onDeleteUser(() => invalidations(["all-users", "current-user", "user-chat", "receiver", "room-member"]));
        }

        if (props.identifier.includes("room-chat")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteAllChatsInRoom(() => invalidations(["room-chat"]));
            onDeleteChatInRoom(() => invalidations(["room-chat"]));
            onSendToRoom(() => invalidations(["room-chat"]));
        }

        if (props.identifier.includes("room-member")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "room-member"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
            onDeleteUser(() => invalidations(["current-user", "room-member", "user-chat"]));
            onJoinNewMember(() => invalidations(["available-room", "room-member"]));
            onKickMember(() => invalidations(["available-room", "room-member"]));
            onLeftTheRoom(() => invalidations(["available-room", "current-user", "receiver", "room-member"]));
        }

        if (props.identifier.includes("room-profile")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
        }

        if (props.identifier.includes("user-chat")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "receiver", "room-member"]));
            onDeleteAllChats(() => invalidations(["user-chat"]));
            onDeleteChat(() => invalidations(["user-chat"]));
            onDeleteUser(() => invalidations(["current-user", "user-chat"]));
            onSendToUser(() => invalidations(["user-chat"]));
        }

        if (props.identifier.includes("user-profile")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "receiver", "room-member"]));
            onDeleteUser(() => invalidations(["all-users", "current-user", "receiver", "user-chat", "room-member"]));
        }

        return () => {
            if (socket) {
                socket.off("room-chat:send-new-chat", () => invalidations(["room-chat"]));
                socket.off("room-chat:all-deleted", () => invalidations(["room-chat"]));
                socket.off("room-chat:deleted", () => invalidations(["room-chat"]));
                socket.off("room-profile:changed", () => invalidations(["available-room", "room-profile"]));
                socket.off("room:deleted", () => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
                socket.off("room:member-kicked", () => invalidations(["available-room", "room-member"]));
                socket.off("user-chat:send-new-chat", () => invalidations(["user-chat"]));
                socket.off("user-chat:all-deleted", () => invalidations(["user-chat"]));
                socket.off("user-chat:deleted", () => invalidations(["user-chat"]));
                socket.off("user-profile:changed", () => invalidations(["all-users", "current-user", "receiver", "room-member"]));
                socket.off("user:deleted", () => invalidations(["all-users", "current-user", "receiver", "user-chat", "room-member"]));
                socket.off("user:join-room-successfully", () => invalidations(["available-room", "room-member"]));
                socket.off("user:left-room-successfully", () => invalidations(["current-user", "receiver", "room-member"]));
            }
        }
        
    }, [props.identifier, currentUserId, props.marks, queryClient]);
}