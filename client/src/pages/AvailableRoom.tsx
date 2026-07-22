import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import useRoomChatService from "../services/useRoomChatService";
import RoomList from "../components/RoomList";
import useRoomMemberService from "../services/useRoomMemberService";
import useRoomProfileService from "../services/useRoomProfileService";
import RoomWindow from "../components/RoomWindow";
import useUserProfileService from "../services/useUserProfileService";
import { MessageCircle } from "lucide-react";
import { useRoomStore } from "../stores/room.store";
import useSocketIo from "../hooks/useSocketIo";
import cn from "../utils/cn";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";
import RoomChatDeleteOption1 from "../components/RoomChatDeleteOption1";
import RoomChatDeleteOption2 from "../components/RoomChatDeleteOption2";

export default function AvailableRoom() {
    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const showMember = useRoomStore((state) => state.showMember);
    const setShowMember = useRoomStore((state) => state.setShowMember);

    const showProfile = useRoomStore((state) => state.showProfile);
    const setShowProfile = useRoomStore((state) => state.setShowProfile);

    const { currentUser, isUserProfileProcessing } = useUserProfileService({ setMessage: setMessage });

    const { 
        currentRoomMember, 
        isRoomMemberProcessing, 
        leftRoomMt 
    } = useRoomMemberService({ roomId: roomId, setMessage: setMessage });

    const { 
        currentAvailableRooms,  
        currentRoomProfile, 
        deleteRoomMt, 
        isRoomProfileProcessing 
    } = useRoomProfileService({ currentUserId: currentUser.user?.user_id, roomId: roomId, setMessage: setMessage });

    const { 
        allChatsInRoom, 
        clearAllRoomChatsForMeMt,
        clearChosenRoomChatsForMeMt,
        clearChatsIdsSelection,
        deleteAllChatsInRoomMt,
        deleteChosenChatsInRoomMt,
        isRoomChatProcessing, 
        isSelectMode,
        selectedChatsIds,
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        setText,
        sendChatToRoomMt,
        showDeleteOption1, 
        showDeleteOption2,
        text,
        toggleSelect
    } = useRoomChatService({ roomId: roomId });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useSocketIo({
        identifier: ["available-room", "room-chat", "room-profile", "room-member"],
        currentUserId: currentUser.user?.user_id!,
        marks: roomId
    });

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-screen relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isRoomChatProcessing || isUserProfileProcessing}/>
            {showDeleteOption1 ? (
                <RoomChatDeleteOption1
                    clearAllRoomChatsForMeMt={clearAllRoomChatsForMeMt}
                    deleteAllChatsInRoomMt={deleteAllChatsInRoomMt}
                    isProcessing={isRoomChatProcessing || isUserProfileProcessing || isRoomProfileProcessing || isRoomMemberProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption1={setShowDeleteOption1}
                />
            ) : null}
            {showDeleteOption2 ? (
                <RoomChatDeleteOption2
                    clearChosenRoomChatsForMeMt={clearChosenRoomChatsForMeMt}
                    deleteChosenChatsInRoomMt={deleteChosenChatsInRoomMt}
                    clearSelection={clearChatsIdsSelection}
                    isProcessing={isRoomChatProcessing || isUserProfileProcessing || isRoomProfileProcessing || isRoomMemberProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption2={setShowDeleteOption2}
                />
            ) : null}
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
                    clearChatsIdsSelection={clearChatsIdsSelection}
                    deleteRoomMt={deleteRoomMt}
                    fetchNextRoomChat={allChatsInRoom.fecthNextRoomChat}
                    fetchNextUser={currentRoomMember.fetchNextRoomMember}
                    hasNextRoomChat={allChatsInRoom.roomChatHasNextPage}
                    isFetchingNextRoomChat={allChatsInRoom.isRoomChatFetchNext}
                    isRoomChatLoading={allChatsInRoom.isRoomChatLoading}
                    isRoomMemberLoading={currentRoomMember.isRoomMemberLoading}
                    isRoomProfileLoading={currentRoomProfile.isDetailLoading}
                    isProcessing={isRoomProfileProcessing || isRoomChatProcessing || isRoomMemberProcessing || isUserProfileProcessing}
                    isRoomMemberFetchNextPage={currentRoomMember.isRoomMemberFetchNextPage}
                    isSelectMode={isSelectMode}
                    leftRoomMt={leftRoomMt}
                    roomChats={allChatsInRoom.roomChats}
                    roomChatError={allChatsInRoom.roomChatsError}
                    selectedChatsIds={selectedChatsIds}
                    sendChatToRoom={sendChatToRoomMt}
                    roomProfile={currentRoomProfile.detail!}
                    roomMemberError={currentRoomMember.roomMemberError}
                    roomMemberHaveNextPage={currentRoomMember.roomMmeberHaveNextPage}
                    roomProfileError={currentRoomProfile.errorDetail}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption2={setShowDeleteOption2}
                    setShowMember={setShowMember}
                    setShowProfile={setShowProfile}
                    setText={setText}
                    showMember={showMember}
                    showProfile={showProfile}
                    text={text}
                    toggleSelect={toggleSelect}
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