import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null;

export default function useSocketIoServices() {

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

    function onAvailableUserJoin(userId: string) {
        socket?.emit("join:available-user", userId);
    }

    function onRoomChatJoin(roomId: string) {
        socket?.emit("join:room-chat", roomId);
    }

    function onRoomMemberJoin(roomId: string) {
        socket?.emit("join:room-member", roomId);
    }

    function onRoomProfileJoin(roomId: string) {
        socket?.emit("join:room-profile", roomId);
    }

    function onUserChatJoin(userId: string) {
        socket?.emit("join:user-chat", userId);
    }

    function onUserProfileJoin(userId: string) {
        socket?.emit("join:user-profile", userId);
    }

    function onChangeRoom(callback: (data: any) => void) {
        socket?.on("room-profile:changed", callback);
    }

    function onChangeUser(callback: (data: any) => void) {
        socket?.on("user-profile:changed", callback);
    }

    function onDeleteAllChatsPermanently(callback: (data: any) => void) {
        socket?.on("user-chat:all-deleted-permanently", callback);
    }

    function onDeleteAllChats(callback: (data: any) => void) {
        socket?.on("user-chat:all-deleted", callback);
    }

    function onDeleteChatPermanently(callback: (data: any) => void) {
        socket?.on("user-chat:deleted-permanently", callback);
    }

    function onDeleteChat(callback: (data: any) => void) {
        socket?.on("user-chat:deleted", callback);
    }

    function onDeleteAllChatsPermanentlyInRoom(callback: (data: any) => void) {
        socket?.on("room-chat:all-deleted-permanently", callback);
    }

    function onDeleteAllChatsInRoom(callback: (data: any) => void) {
        socket?.on("room-chat:all-deleted", callback);
    }

    function onDeleteChatPermanentlyInRoom(callback: (data: any) => void) {
        socket?.on("room-chat:deleted-permanently", callback);
    }

    function onDeleteChatInRoom(callback: (data: any) => void) {
        socket?.on("room-chat:deleted", callback);
    }

    function onDeleteRoom(callback: (data: any) => void) {
        socket?.on("room:deleted", callback);
    }

    function onDeleteUser(callback: (data: any) => void) {
        socket?.on("user:deleted", callback);
    }

    function onJoinNewMember(callback: (data: any) => void) {
        socket?.on("user:join-room-successfully", callback);
    }

    function onKickMember(callback: (data: any) => void) {
        socket?.on("room:member-kicked", callback);
    }

    function onLeftTheRoom(callback: (data: any) => void) {
        socket?.on("user:left-room-successfully", callback);
    }

    function onSendToUser(callback: (data: any) => void) {
        socket?.on("user-chat:send-new-chat", callback);
    }

    function onSendToRoom(callback: (data: any) => void) {
        socket?.on("room-chat:send-new-chat", callback);
    }

    function removeAllListeners() {
        socket?.removeAllListeners();
    }

    function disconnect() {
        socket?.disconnect();
        socket = null;
    }

    function getSocket() {
        return socket;
    }
    
    return {
        connect,
        disconnect,
        getSocket,
        onAvailableRoomJoin,
        onAvailableUserJoin,
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
        onJoinNewMember,
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
    }
}