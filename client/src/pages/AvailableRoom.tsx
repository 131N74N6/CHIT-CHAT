import Alert from "../components/Alert";
import availableRoomService from "../services/available_room.service";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import roomChatService from "../services/room_chat.service";
import RoomList from "../components/RoomList";
import roomMemberService from "../services/room_member.service";
import roomProfileService from "../services/room_profile.service";
import RoomWindow from "../components/RoomWindow";
import UserServices from "../services/user.service";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useRoomStore } from "../stores/room.store";

export default function AvailableRoom() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const createdAt = useRoomStore((state) => state.createdAt);
    const setCreatedAt = useRoomStore((state) => state.setCreatedAt);

    const description = useRoomStore((state) => state.description);
    const setDescription = useRoomStore((state) => state.setDescription);

    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);

    const roomName = useRoomStore((state) => state.roomName);
    const setRoomName = useRoomStore((state) => state.setRoomName);

    const oldRoomPicture = useRoomStore((state) => state.oldRoomPicture);
    const setOldRoomPicture = useRoomStore((state) => state.setOldRoomPicture);

    const showMember = useRoomStore((state) => state.showMember);
    const setShowMember = useRoomStore((state) => state.setShowMember);

    const showProfile = useRoomStore((state) => state.showProfile);
    const setShowProfile = useRoomStore((state) => state.setShowProfile);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage])

    const { 
        currentUser, 
        deleteRoomMt,
        isUserProcessing,
        leftRoomMt
    } = UserServices({ setMessage: setMessage });

    const { currentAvailableRooms } = availableRoomService({ currentUserId: currentUser.user?.user_id });

    const { currentRoomMember } = roomMemberService({ roomId: roomId });

    const { currentRoomProfile } = roomProfileService({ roomId: roomId });

    const { 
        allChatsInRoom, 
        clearChatInRoomForMeMt, 
        deleteChaForRoomMt, 
        deleteChatPermanentlyForRoomMt, 
        isRoomChatProcessing, 
        sendChatToRoomMt 
    } = roomChatService({ roomId: roomId, setMessage: setMessage });

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
                        isProcessing={currentAvailableRooms.isAvailableRoomLoading}
                        rooms={currentAvailableRooms.availableRooms}
                        setCreatedAt={setCreatedAt}
                        setDescription={setDescription}
                        setRoomId={setRoomId}
                        setRoomName={setRoomName}
                        setRoomProfilePicture={setOldRoomPicture}
                    />
                )}
            </div>
            {roomId ? (
                <RoomWindow
                    createdAt={createdAt}
                    currentUserId={currentUser.user ? currentUser.user.user_id : "-"}
                    deleteRoomMt={deleteRoomMt}
                    description={description}
                    fetchNextRoomChat={allChatsInRoom.fecthNextRoomChat}
                    fetchNextUser={currentRoomMember.fetchNextRoomMember}
                    hasNextRoomChat={allChatsInRoom.roomChatHasNextPage}
                    isFetchingNextRoomChat={allChatsInRoom.isRoomChatFetchNext}
                    isLoading={
                        allChatsInRoom.isRoomChatLoading || 
                        currentRoomMember.isRoomMemberLoading || 
                        currentRoomProfile.isDetailLoading
                    }
                    isProcessing={
                        currentRoomProfile.isDetailLoading || 
                        isRoomChatProcessing || 
                        allChatsInRoom.isRoomChatLoading || 
                        currentRoomMember.isRoomMemberLoading ||
                        isUserProcessing
                    }
                    isRoomMemberFetchNextPage={currentRoomMember.isRoomMemberFetchNextPage}
                    leftRoomMt={leftRoomMt}
                    onClearOne={clearChatInRoomForMeMt}
                    onDeleteOne={deleteChaForRoomMt}
                    onDeleteOnePermanent={deleteChatPermanentlyForRoomMt}
                    roomChats={allChatsInRoom.roomChats}
                    roomChatError={allChatsInRoom.roomChatsError}
                    sendChatToRoom={sendChatToRoomMt}
                    roomId={roomId}
                    roomMemberError={currentRoomMember.roomMemberError}
                    roomMemberHaveNextPage={currentRoomMember.roomMmeberHaveNextPage}
                    roomName={roomName}
                    roomProfileError={currentRoomProfile.errorDetail}
                    roomProfilePicture={oldRoomPicture}
                    setShowMember={setShowMember}
                    setShowProfile={setShowProfile}
                    showMember={showMember}
                    showProfile={showProfile}
                    users={currentRoomMember.roomMember}
                />
            ) : (
                <div className="md:flex md:justify-center md:items-center md:h-full md:bg-white hidden">
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-500 font-medium flex justify-center"><MessageCircle size={34}/></div>
                        <div className="text-gray-700 font-medium text-center">
                            Welcome to Chit Chat
                        </div>
                    </div>
                </div>
            )}
            <Navbar isProcessing={isRoomChatProcessing || isUserProcessing}/>
        </section>
    );
}