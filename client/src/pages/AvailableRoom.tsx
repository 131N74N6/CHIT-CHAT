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
    const chatId = useChatStore((state) => state.chatId);
    const setChatId = useChatStore((state) => state.setChatId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const showMember = useRoomStore((state) => state.showMember);
    const setShowMember = useRoomStore((state) => state.setShowMember);

    const showProfile = useRoomStore((state) => state.showProfile);
    const setShowProfile = useRoomStore((state) => state.setShowProfile);

    const { currentUser, isUserProfileProcessing } = useUserProfileService();

    const { 
        currentRoomMember, 
        isRoomOwner,
        isRoomMemberProcessing, 
        kickMemberMt,
        leftRoomMt 
    } = useRoomMemberService();

    const { 
        availableRooms,  
        changeRoomMt,
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
        roomChatMedia,
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
        toggleSelect,
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
        const savedUserChatId = localStorage.getItem("chat_id");
        if (savedUserChatId && !chatId) setChatId(savedUserChatId);
    }, []); 

    useEffect(() => {
        if (chatId) {
            localStorage.setItem("chat_id", chatId);
        } else {
            localStorage.removeItem("chat_id");
        }
    }, [chatId]);

    useEffect(() => {
        if (editMode) {
            currentRoomProfile.data && currentRoomProfile.data.name ?
            setRoomName(currentRoomProfile.data.name) :
            setRoomName("");
            currentRoomProfile.data && currentRoomProfile.data.description ? 
            setDescription(currentRoomProfile.data.description) :
            setDescription("-");
            currentRoomProfile.data && currentRoomProfile.data.profile_picture !== null ? 
            setOldRoomPicture(currentRoomProfile.data.profile_picture) :
            setOldRoomPicture(null);
        } else {
            setRoomName("");
            setDescription("");
            setOldRoomPicture(null);
        }
    }, [editMode, roomId, currentRoomProfile.data]);

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
                {availableRooms.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : availableRooms.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {availableRooms.error.message}
                        </div>
                    </div>
                ) : (
                    <RoomList
                        fetchNextPage={availableRooms.fetchNextPage}
                        hasNextPage={availableRooms.hasNextPage}
                        isFetchingNextPage={availableRooms.isFetchingNextPage}
                        isProcessing={isRoomProfileProcessing}
                        rooms={availableRooms.data ? availableRooms.data.pages.flat() : []}
                        setRoomId={setRoomId}
                    />
                )}
            </div>
            {roomId ? (
                <RoomWindow
                    chatId={chatId}
                    changeRoomMt={changeRoomMt}
                    currentUserId={currentUser.data ? currentUser.data.user_id : ""}
                    clearChatsIdsSelection={clearChatsIdsSelection}
                    deleteRoomMt={deleteRoomMt}
                    description={description}
                    editMode={editMode}
                    fetchNextRoomChat={allChatsInRoom.fetchNextPage}
                    fetchNextUser={currentRoomMember.fetchNextPage}
                    fileInputRef={fileInputRef}
                    handleImagePreview={handleImagePreview}
                    handleMediaPreview={handleMediaPreview}
                    hasNextRoomChat={allChatsInRoom.hasNextPage}
                    inputMediaRef={inputMediaRef}
                    isFetchingNextRoomChat={allChatsInRoom.isFetchingNextPage}
                    isRoomChatLoading={allChatsInRoom.isLoading}
                    isRoomChatProcessing={isRoomChatProcessing}
                    isRoomMemberLoading={currentRoomMember.isLoading}
                    isRoomOwner={isRoomOwner}
                    isRoomProfileLoading={currentRoomProfile.isLoading}
                    isRoomProfileProcessing={isRoomProfileProcessing}
                    isRoomMemberFetchNextPage={currentRoomMember.isFetchingNextPage}
                    isSelectMode={isSelectMode}
                    kickMemberMt={kickMemberMt}
                    leftRoomMt={leftRoomMt}
                    media={media}
                    oldRoomPicture={oldRoomPicture}
                    removeOnePreviewFile={removeOnePreviewFile}
                    roomChats={allChatsInRoom.data ? allChatsInRoom.data.pages.flatMap(page => page).reverse() : []}
                    roomChatError={allChatsInRoom.error}
                    roomChatMedia={roomChatMedia}
                    roomId={roomId}
                    roomName={roomName}
                    roomProfile={currentRoomProfile.data!}
                    roomMemberError={currentRoomMember.error}
                    roomMemberHaveNextPage={currentRoomMember.hasNextPage}
                    roomProfileError={currentRoomProfile.error}
                    setIsSelectMode={setIsSelectMode}
                    selectedProfileRoom={selectedProfileRoom}
                    selectedProfileRoomUrl={selectedProfileRoomUrl}
                    setReceiverId={setReceiverId}
                    setRoomId={setRoomId}
                    selectedChatsIds={selectedChatsIds}
                    sendChatToRoom={sendChatToRoomMt}
                    setChatId={setChatId}
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
                    users={currentRoomMember.data ? currentRoomMember.data.pages.flat() : []}
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