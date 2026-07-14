import { useEffect } from "react";
import socketIoServices from "../services/socket-io.service";
import { useQueryClient } from "@tanstack/react-query";

interface ChatSocketIntrf {
    user_id: string;
    marks: string[];
    identifier?: string;
}

export default function useSocketIo(props: ChatSocketIntrf) {
    const queryClient = useQueryClient();

    const {
        connect
    } = socketIoServices();

    useEffect(() => {
        if (!props.user_id) return;
        connect(props.user_id);

        if (props.identifier === "")
    }, [props.identifier, props.user_id, queryClient]);

    return {}
}