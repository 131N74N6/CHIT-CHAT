import { io, type Socket } from "socket.io-client"

export default function useSocketIoServices() {
    let socket: Socket | null = null;

    function connect(currentUserId: string) {
        if (socket?.connected) return;

        socket = io(new URL(`${import.meta.env.VITE_BASE_API_URL}`).origin, {
            auth: { currentUserId },
            transports: ["websocket"]
        });

        socket.on("connect", () => {
            console.log(`socket connected: ${socket?.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`socket disconnected: ${socket?.id}`);
        });

        socket.on("connect_error", (error) => {
            console.log(`socket connection error: ${error.message}`);
        });
    }

    function onAvailableRoomJoin(userId: string) {
        socket?.emit("join:available-room", userId);
    }

    function onChangeRoom(callback: (data: any) => void) {
        socket?.on("room:profile-changed", callback);
    }

    function onChangeUser(callback: (data: any) => void) {
        socket?.on("user:changed", callback);
    }

    function onDeleteAllChatsPermanently(callback: (data: any) => void) {
        socket?.on("chat:all-deleted-permanently", callback);
    }

    function onDeleteAllChats(callback: (data: any) => void) {
        socket?.on("chat:all-deleted", callback);
    }

    function onDeleteChatPermanently(callback: (data: any) => void) {
        socket?.on("chat:deleted-permanently", callback);
    }

    function onDeleteChat(callback: (data: any) => void) {
        socket?.on("chat:deleted", callback);
    }

    function onDeleteAllChatsPermanentlyInRoom(callback: (data: any) => void) {
        socket?.on("room:deleted-all-chats-permanently", callback);
    }

    function onDeleteAllChatsInRoom(callback: (data: any) => void) {
        socket?.on("room:deleted-all-chat", callback);
    }

    function onDeleteChatPermanentlyInRoom(callback: (data: any) => void) {
        socket?.on("room:chat-deleted-permanently", callback);
    }

    function onDeleteChatInRoom(callback: (data: any) => void) {
        socket?.on("room:chat-deleted", callback);
    }

    function onDeleteRoom(callback: (data: any) => void) {
        socket?.on("room:deleted", callback);
    }

    function onDeleteUser(callback: (data: any) => void) {
        socket?.on("user:deleted", callback);
    }

    function onKickMember(callback: (data: any) => void) {
        socket?.on("room:member-kicked", callback);
    }

    function onLeftTheRoom(callback: (data: any) => void) {
        socket?.on("user:left", callback);
    }

    function onReceiverJoin(receiverId: string) {
        socket?.emit("join:receiver", receiverId);
    }

    function onReceiverProfileJoin(receiverId: string) {
        socket?.emit("join:receiver-profile", receiverId);
    }

    function onRoomChatJoin(roomId: string) {
        socket?.emit("join:room-chat", roomId);
    }

    function onRoomProfileJoin(roomId: string) {
        socket?.emit("join:room-profile", roomId);
    }

    function onSendToUser(callback: (data: any) => void) {
        socket?.on("chat:send", callback);
    }

    function onSendToRoom(callback: (data: any) => void) {
        socket?.on("room-chat:send", callback);
    }
    
    return {
        connect,
        onAvailableRoomJoin,
        onChangeRoom,
        onChangeUser,
        onDeleteAllChats,
        onDeleteChat,
        onDeleteAllChatsInRoom,
        onDeleteChatInRoom,
        onDeleteAllChatsPermanently,
        onDeleteChatPermanently,
        onDeleteAllChatsPermanentlyInRoom,
        onDeleteChatPermanentlyInRoom,
        onDeleteRoom,
        onDeleteUser,
        onKickMember,
        onLeftTheRoom,
        onReceiverJoin,
        onReceiverProfileJoin,
        onRoomChatJoin,
        onRoomProfileJoin,
        onSendToRoom,
        onSendToUser
    }
}