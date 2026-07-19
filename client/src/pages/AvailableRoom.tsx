import useAvailableRoomService from "../services/useAvailableRoomService";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import useRoomChatService from "../services/useRoomChatService";
import RoomList from "../components/RoomList";
import useRoomMemberService from "../services/useRoomMemberService";
import useRoomProfileService from "../services/useRoomProfileService";
import RoomWindow from "../components/RoomWindow";
import useUserServices from "../services/useUserService";
import { MessageCircle } from "lucide-react";
import { useRoomStore } from "../stores/room.store";
import useSocketIo from "../hooks/useSocketIo";
import cn from "../utils/cn";

export default function AvailableRoom() {
    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);

    const showMember = useRoomStore((state) => state.showMember);
    const setShowMember = useRoomStore((state) => state.setShowMember);

    const showProfile = useRoomStore((state) => state.showProfile);
    const setShowProfile = useRoomStore((state) => state.setShowProfile);

    const { 
        currentUser, 
        deleteRoomMt,
        isUserProcessing,
        leftRoomMt
    } = useUserServices();

    useSocketIo({
        identifier: ["available-room", "room-chat", "room-profile", "room-member"],
        currentUserId: currentUser.user?.user_id!,
        marks: roomId
    });

    const { currentAvailableRooms } = useAvailableRoomService({ currentUserId: currentUser.user?.user_id });

    const { currentRoomMember } = useRoomMemberService({ roomId: roomId });

    const { currentRoomProfile } = useRoomProfileService({ roomId: roomId });

    const { 
        allChatsInRoom, 
        clearChatInRoomForMeMt, 
        deleteChaForRoomMt, 
        deleteChatPermanentlyForRoomMt, 
        isRoomChatProcessing, 
        sendChatToRoomMt 
    } = useRoomChatService({ roomId: roomId });

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-screen relative z-10">
            <Navbar isProcessing={isRoomChatProcessing || isUserProcessing}/>
            <div className="flex flex-col md:w-2/5 h-full px-2.5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400">
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
                        setRoomId={setRoomId}
                    />
                )}
            </div>
            {roomId ? (
                <RoomWindow
                    currentUserId={currentUser.user ? currentUser.user.user_id : "-"}
                    deleteRoomMt={deleteRoomMt}
                    fetchNextRoomChat={allChatsInRoom.fecthNextRoomChat}
                    fetchNextUser={currentRoomMember.fetchNextRoomMember}
                    hasNextRoomChat={allChatsInRoom.roomChatHasNextPage}
                    isFetchingNextRoomChat={allChatsInRoom.isRoomChatFetchNext}
                    isRoomChatLoading={allChatsInRoom.isRoomChatLoading}
                    isRoomMemberLoading={currentRoomMember.isRoomMemberLoading}
                    isRoomProfileLoading={currentRoomProfile.isDetailLoading}
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
                    roomProfile={currentRoomProfile.detail!}
                    roomMemberError={currentRoomMember.roomMemberError}
                    roomMemberHaveNextPage={currentRoomMember.roomMmeberHaveNextPage}
                    roomProfileError={currentRoomProfile.errorDetail}
                    setShowMember={setShowMember}
                    setShowProfile={setShowProfile}
                    showMember={showMember}
                    showProfile={showProfile}
                    users={currentRoomMember.roomMember}
                />
            ) : (
                <div 
                    className={cn(
                        "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                        "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                        "border border-gray-400"
                    )}
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-500 font-medium flex justify-center">
                            <MessageCircle size={34}/>
                        </div>
                        <div className="text-gray-700 font-medium text-center">
                            Welcome to Chit Chat
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}