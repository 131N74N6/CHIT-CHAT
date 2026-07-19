import { useEffect } from "react";
import useSocketIoService from "../services/useSocketIoService";
import { Query, useQueryClient } from "@tanstack/react-query";

interface ChatSocketIntrf {
    currentUserId: string;
    identifier: string[];
    marks: string;
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();

    const {
        connect,
        onAvailableRoomJoin,
        onAvailableUserJoin,
        onChangeRoom,
        onChangeUser,
        onDeleteAllChatsInRoom,
        onDeleteAllChatsPermanentlyInRoom,
        onDeleteChatInRoom,
        onDeleteChatPermanentlyInRoom,
        onDeleteAllChats,
        onDeleteAllChatsPermanently,
        onDeleteChat,
        onDeleteChatPermanently,
        onDeleteRoom,
        onDeleteUser,
        onKickMember,
        onLeftTheRoom,
        onUserChatJoin,
        onUserProfileJoin,
        onRoomChatJoin,
        onRoomMemberJoin,
        onRoomProfileJoin,
        onSendToRoom,
        onSendToUser,
        removeAllListeners
    } = useSocketIoService();

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

    useEffect(() => {
        if (!props.currentUserId) return;
        connect(props.currentUserId);

        if (props.identifier.includes("available-room")) {
            onAvailableRoomJoin(props.marks);
        } else if (props.identifier.includes("available-user")) {
            onAvailableUserJoin(props.marks);
        } else if (props.identifier.includes("room-chat")) {
            onRoomChatJoin(props.marks);
        } else if (props.identifier.includes("room-member")) {
            onRoomMemberJoin(props.marks);
        } else if (props.identifier.includes("room-profile")) {
            onRoomProfileJoin(props.marks);
        } else if (props.identifier.includes("user-chat")) {
            onUserChatJoin(props.marks);
        } else {
            onUserProfileJoin(props.marks);
        }

        if (props.identifier.includes("available-rooms")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
        }

        if (props.identifier.includes("available-users")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "user", "room-member"]));
            onDeleteUser(() => invalidations(["all-users", "current-user", "user-chat", "user", "room-member"]));
        }

        if (props.identifier.includes("room-chat")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteAllChatsInRoom(() => invalidations(["room-chat"]));
            onDeleteAllChatsPermanentlyInRoom(() => invalidations(["room-chat"]));
            onDeleteChatInRoom(() => invalidations(["room-chat"]));
            onDeleteChatPermanentlyInRoom(() => invalidations(["room-chat"]));
            onSendToRoom(() => invalidations(["room-chat"]));
        }

        if (props.identifier.includes("room-member")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "room-member"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
            onDeleteUser(() => invalidations(["current-user", "room-member", "user-chat"]));
            onKickMember(() => invalidations(["room-member"]));
            onLeftTheRoom(() => invalidations(["current-user", "user", "room-member"]));
        }

        if (props.identifier.includes("room-profile")) {
            onChangeRoom(() => invalidations(["room-profile", "available-room"]));
            onDeleteRoom(() => invalidations(["available-room", "room-profile", "room-chat", "room-member"]));
        }

        if (props.identifier.includes("user-chat")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "user"]));
            onDeleteAllChats(() => invalidations(["user-chat"]));
            onDeleteAllChatsPermanently(() => invalidations(["user-chat"]));
            onDeleteChatPermanently(() => invalidations(["user-chat"]));
            onDeleteChat(() => invalidations(["user-chat"]));
            onDeleteUser(() => invalidations(["current-user", "user-chat", "user"]));
            onSendToUser(() => invalidations(["user-chat"]));
        }

        if (props.identifier.includes("user-profile")) {
            onChangeUser(() => invalidations(["all-users", "current-user", "user", "room-member"]));
            onDeleteUser(() => invalidations(["all-users", "current-user", "user", "user-chat", "room-member"]));
        }

        return () => removeAllListeners();
        
    }, [props.identifier, props.currentUserId, props.marks, queryClient]);
}