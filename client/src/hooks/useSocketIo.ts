import { useEffect } from "react";
import socketIoServices from "../services/socket_io.service";
import { Query, useQueryClient } from "@tanstack/react-query";

interface ChatSocketIntrf {
    currentUserId: string;
    identifier: string[];
    marks: string;
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();

    const {
        availableRoomJoin,
        connect,
        receiverJoin,
        receiverProfileJoin,
        roomChatJoin,
        roomProfileJoin
    } = socketIoServices();

    const allUsersQueryNames = ['all-users'];
    const currentUserQueryNames = ['current-user'];
    const roomDetailQueryNames = ['room-profile', 'room-member', 'available-room', 'room-chat'];
    const userChatQueryNames = ['user-chat'];

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
            availableRoomJoin(props.marks);
        } else if (props.identifier.includes("room-chat")) {
            roomChatJoin(props.marks);
        } else if (props.identifier.includes("room-profile")) {
            roomProfileJoin(props.marks);
        } else if (props.identifier.includes("user-chat")) {
            receiverJoin(props.marks);
        } else {
            receiverProfileJoin(props.marks);
        }

        if (props.identifier.includes("available-room")) {
            
        }
        
    }, [props.identifier, props.currentUserId, queryClient]);

    return {}
}