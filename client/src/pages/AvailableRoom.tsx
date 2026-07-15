import Alert from "../components/Alert";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import RoomChatWindow from "../components/RoomChatWindow";
import RoomList from "../components/RoomList";
import RoomServices from "../services/room.service";
import UserServices from "../services/user.service";
import { useMessageStore } from "../stores/message.store";
import { useWindowStore } from "../stores/window.store";

export default function AvailableRoom() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const roomId = useWindowStore((state) => state.roomId);
    const setRoomId = useWindowStore((state) => state.setRoomId);

    const roomName = useWindowStore((state) => state.roomName);
    const setRoomName = useWindowStore((state) => state.setRoomName);

    const roomProfilePicture = useWindowStore((state) => state.roomProfilePicture);
    const setRoomProfilePicture = useWindowStore((state) => state.setRoomProfilePicture);

    const { currentUser, isUserProcessing } = UserServices();

    const { 
        allChatsInRoom,
        clearChatInRoomForMeMt,
        currentAvailableRooms, 
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        isRoomProcessing, 
        sendChatToRoomMt,
    } = RoomServices({ 
        currentUserId: currentUser.user?.user_id, 
        roomId: roomId, 
        setMessage: setMessage 
    });

    return (
        <section className="flex flex-col h-screen relative z-10">
            {message ? <Alert message={message}/> : null}
            <div className="flex md:w-2/4 w-full flex-col p-2.5 h-full">
                {currentAvailableRooms.isAvailableRoomLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : currentAvailableRooms.availableRoomsError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {currentAvailableRooms.availableRoomsError.message}
                        </div>
                    </div>
                ) : (
                    <RoomList
                        fetchNextPage={currentAvailableRooms.fetchNextAvailableRoom}
                        hasNextPage={currentAvailableRooms.availableRoomHasNextPage}
                        isFetchingNextPage={currentAvailableRooms.isFetchNextAvailableRoom}
                        isProcessing={isRoomProcessing}
                        rooms={currentAvailableRooms.availableRooms}
                        setRoomId={setRoomId}
                        setRoomName={setRoomName}
                        setRoomProfilePicture={setRoomProfilePicture}
                    />
                )}
            </div>
            {roomId ? (
                <RoomChatWindow
                    currentUserId={currentUser.user ? currentUser.user.user_id : ""}
                    error={allChatsInRoom.roomChatsError}
                    fetchNextPage={allChatsInRoom.fecthNextRoomChat}
                    hasNextPage={allChatsInRoom.roomChatHasNextPage}
                    isFetchingNextPage={allChatsInRoom.isRoomChatFetchNext}
                    isLoading={allChatsInRoom.isRoomChatLoading}
                    isProcessing={isRoomProcessing || isUserProcessing}
                    onClearOne={clearChatInRoomForMeMt}
                    onDeleteOne={deleteChaForRoomMt}
                    onDeleteOnePermanent={deleteChatPermanentlyForRoomMt}
                    roomChats={allChatsInRoom.roomChats}
                    roomId={roomId}
                    roomName={roomName}
                    roomProfilePicture={roomProfilePicture}
                    sendChatToRoom={sendChatToRoomMt}
                />
            ) : (
                <div className="md:flex md:justify-center md:items-center md:h-full md:bg-white hidden">
                    <div className="text-gray-700 font-medium text-center">
                        Welcome...
                    </div>
                </div>
            )}
            <Navbar isProcessing={isRoomProcessing || isUserProcessing}/>
        </section>
    );
}