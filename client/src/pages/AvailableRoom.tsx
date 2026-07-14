import ChatList from "../components/ChatList";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import RoomList from "../components/RoomList";
import RooServices from "../services/room.service";
import UserServices from "../services/user.service";

export default function AvailableRoom() {
    const { 
        allChatsInRoom,
        clearChatInRoomForMeMt,
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        currentAvailableRooms, 
        isRoomProcessing, 
        roomId, 
        setRoomId 
    } = RooServices();

    const { currentUser } = UserServices();

    return (
        <section className="flex flex-col h-screen relative z-10">
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
                    />
                )}
            </div>
            <div className="md:w-2/4 md:flex md:flex-col md:p-2.5 hidden">
                {roomId ? (
                    <ChatList
                        chats={allChatsInRoom}
                        currentUserId={currentUser.user ? currentUser.user.user_id : ''}
                        fetchNextPage={allChatsInRoom.fecthNextRoomChat}
                        hasNextPage={allChatsInRoom.roomChatHasNextPage}
                        isFetchingNextPage={allChatsInRoom.isRoomChatFetchNext}
                        isProcessing={isRoomProcessing}
                        onClearOne={clearChatInRoomForMeMt}
                        onDeleteOne={deleteChaForRoomMt}
                        onDeleteOnePermanent={deleteChatPermanentlyForRoomMt}
                    />
                ) : allChatsInRoom.isRoomChatLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allChatsInRoom.roomChatsError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {allChatsInRoom.roomChatsError.message}
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full bg-white">
                        <div className="text-gray-700 font-medium text-center">
                            Welcome...
                        </div>
                    </div>
                )}
            </div>
            <Navbar isProcessing={isRoomProcessing}/>
        </section>
    );
}