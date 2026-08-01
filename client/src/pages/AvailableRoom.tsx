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
import { useChatStore } from "../stores/chat.store";

export default function AvailableRoom() {
    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const showMember = useRoomStore((state) => state.showMember);
    const setShowMember = useRoomStore((state) => state.setShowMember);

    const showProfile = useRoomStore((state) => state.showProfile);
    const setShowProfile = useRoomStore((state) => state.setShowProfile);

    const { currentUser, isUserProfileProcessing } = useUserProfileService();

    const { 
        currentRoomMember, 
        isOwnData,
        isRoomOwner,
        isRoomMemberProcessing, 
        kickMemberMt,
        leftRoomMt 
    } = useRoomMemberService();

    const { 
        changeRoomMt,
        currentAvailableRooms,  
        currentRoomProfile, 
        deleteRoomMt, 
        description,
        editMode,
        fileInputRef,
        handleImagePreview,
        isRoomProfileProcessing, 
        oldRoomPicture,
        roomName,
        selectedProfileRoom,
        selectedProfileRoomUrl,
        setDeleteRoomImage,
        setDescription,
        setEditMode,
        setOldRoomPicture,
        setRoomName,
        setSelectedProfileRoom,
        setSelectedProfileRoomUrl
    } = useRoomProfileService();

    const { 
        allChatsInRoom, 
        clearAllRoomChatsForMeMt,
        clearChosenRoomChatsForMeMt,
        clearChatsIdsSelection,
        deleteAllChatsInRoomMt,
        deleteChosenChatsInRoomMt,
        handleMediaPreview,
        inputMediaRef,
        isRoomChatProcessing, 
        isSelectMode,
        media,
        removeOnePreviewFile,
        selectedChatsIds,
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        setShowRoomMedia,
        setText,
        sendChatToRoomMt,
        showDeleteOption1, 
        showDeleteOption2,
        showRoomMedia,
        text,
        toggleSelect
    } = useRoomChatService();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        const savedRoomId = localStorage.getItem("room_id");
        if (savedRoomId && !roomId) setRoomId(savedRoomId);
    }, []); 

    useEffect(() => {
        if (roomId) {
            localStorage.setItem("room_id", roomId);
        } else {
            localStorage.removeItem("room_id");
        }
    }, [roomId]);

    useEffect(() => {
        if (editMode) {
            currentRoomProfile.detail && currentRoomProfile.detail.name ?
            setRoomName(currentRoomProfile.detail.name) :
            setRoomName("");
            currentRoomProfile.detail && currentRoomProfile.detail.description ? 
            setDescription(currentRoomProfile.detail.description) :
            setDescription("-");
            currentRoomProfile.detail && currentRoomProfile.detail.profile_picture !== null ? 
            setOldRoomPicture(currentRoomProfile.detail.profile_picture) :
            setOldRoomPicture(null);
        } else {
            setRoomName("");
            setDescription("");
            setOldRoomPicture(null);
        }
    }, [editMode, roomId, currentRoomProfile.detail]);

    useSocketIo({
        identifier: ["available-room", "room-chat", "room-profile", "room-member"]
    });

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-dvh relative z-10">
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
            <div className="flex flex-col md:w-2/5 h-full px-2.5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
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
                    changeRoomMt={changeRoomMt}
                    currentUserId={currentUser.user ? currentUser.user.user_id : "-"}
                    clearChatsIdsSelection={clearChatsIdsSelection}
                    deleteRoomMt={deleteRoomMt}
                    description={description}
                    editMode={editMode}
                    fetchNextRoomChat={allChatsInRoom.fecthNextRoomChat}
                    fetchNextUser={currentRoomMember.fetchNextRoomMember}
                    fileInputRef={fileInputRef}
                    handleImagePreview={handleImagePreview}
                    handleMediaPreview={handleMediaPreview}
                    hasNextRoomChat={allChatsInRoom.roomChatHasNextPage}
                    inputMediaRef={inputMediaRef}
                    isFetchingNextRoomChat={allChatsInRoom.isRoomChatFetchNext}
                    isOwnData={isOwnData}
                    isRoomChatLoading={allChatsInRoom.isRoomChatLoading}
                    isRoomChatProcessing={isRoomChatProcessing}
                    isRoomMemberLoading={currentRoomMember.isRoomMemberLoading}
                    isRoomOwner={isRoomOwner}
                    isRoomProfileLoading={currentRoomProfile.isDetailLoading}
                    isRoomProfileProcessing={isRoomProfileProcessing}
                    isRoomMemberFetchNextPage={currentRoomMember.isRoomMemberFetchNextPage}
                    isSelectMode={isSelectMode}
                    kickMemberMt={kickMemberMt}
                    leftRoomMt={leftRoomMt}
                    media={media}
                    oldRoomPicture={oldRoomPicture}
                    removeOnePreviewFile={removeOnePreviewFile}
                    roomChats={allChatsInRoom.roomChats}
                    roomChatError={allChatsInRoom.roomChatsError}
                    roomId={roomId}
                    roomName={roomName}
                    roomProfile={currentRoomProfile.detail!}
                    roomMemberError={currentRoomMember.roomMemberError}
                    roomMemberHaveNextPage={currentRoomMember.roomMmeberHaveNextPage}
                    roomProfileError={currentRoomProfile.errorDetail}
                    setIsSelectMode={setIsSelectMode}
                    selectedProfileRoom={selectedProfileRoom}
                    selectedProfileRoomUrl={selectedProfileRoomUrl}
                    setReceiverId={setReceiverId}
                    setRoomId={setRoomId}
                    selectedChatsIds={selectedChatsIds}
                    sendChatToRoom={sendChatToRoomMt}
                    setDeleteRoomImage={setDeleteRoomImage}
                    setDescription={setDescription}
                    setEditMode={setEditMode}
                    setOldRoomPicture={setOldRoomPicture}
                    setRoomName={setRoomName}
                    setSelectedProfileRoom={setSelectedProfileRoom}
                    setSelectedProfileRoomUrl={setSelectedProfileRoomUrl}
                    setShowDeleteOption1={setShowDeleteOption1}
                    setShowDeleteOption2={setShowDeleteOption2}
                    setShowMember={setShowMember}
                    setShowProfile={setShowProfile}
                    setShowRoomMedia={setShowRoomMedia}
                    setText={setText}
                    showMember={showMember}
                    showProfile={showProfile}
                    showRoomMedia={showRoomMedia}
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