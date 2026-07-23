import { useEffect } from "react";
import useSocketIoService from "../services/useSocketIoService";
import { Query, useQueryClient } from "@tanstack/react-query";

interface ChatSocketIntrf {
    currentUserId: string;
    identifier: string[];
    marks?: { receiverId?: string; roomId?: string };
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();

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
        if (!props.currentUserId) return;
        connect(props.currentUserId);

        if (props.identifier.includes("available-room")) {
            onAvailableRoomJoin(props.currentUserId);
        } else if (props.identifier.includes("available-user")) {
            onAvailableUserJoin(props.currentUserId);
        } else if (props.identifier.includes("room-chat")) {
            onRoomChatJoin(props.marks?.roomId!);
        } else if (props.identifier.includes("room-member")) {
            onRoomMemberJoin(props.marks?.roomId!);
        } else if (props.identifier.includes("room-profile")) {
            onRoomProfileJoin(props.marks?.roomId!);
        } else if (props.identifier.includes("user-chat")) {
            onUserChatJoin(props.currentUserId);
        } else {
            onUserProfileJoin(props.marks?.receiverId!);
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
            onJoinNewMember(() => invalidations(["room-member"]));
            onKickMember(() => invalidations(["available-room", "room-member"]));
            onLeftTheRoom(() => invalidations(["available-room", "current-user", "receiver", "room-member"]));
        }

        if (props.identifier.includes("room-profile")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
        }

        if (props.identifier.includes("user-chat")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "user"]));
            onDeleteAllChats(() => invalidations(["user-chat"]));
            onDeleteChat(() => invalidations(["user-chat"]));
            onDeleteUser(() => invalidations(["current-user", "user-chat", "user"]));
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
                socket.off("user:user:join-room-successfully", () => invalidations(["room-member"]));
                socket.off("user:left-room-successfully", () => invalidations(["current-user", "receiver", "room-member"]));
            }
        }
        
    }, [props.identifier, props.currentUserId, props.marks, queryClient]);
}