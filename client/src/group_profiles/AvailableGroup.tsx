import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import RoomWindow from "../components/RoomWindow";
import { MessageCircle } from "lucide-react";
import cn from "../utils/cn";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";
import GroupList from "./GroupList";
import useGroupProfileService from "./service";
import useGroupChatService from "../group_chats/service";
import useGroupMemberService from "../group_member/service";
import { useGroupChatStore } from "../group_chats/store";
import PopUpOption from "../group_chats/PopUpOption";

export default function AvailableGroup() {
    const groupId = useGroupChatStore((state) => state.groupId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const openPopUpOption = useGroupChatStore((state) => state.openPopUpOption);
    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);

    const groupChat = useGroupChatService();
    const groupProfile = useGroupProfileService();
    const groupMember = useGroupMemberService();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

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

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-dvh relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}/>
            {!openPopUpOption ? null : (
                <PopUpOption
                    isProcessing={groupChat.isProcessing}
                    clearAll={groupChat.clearAllMessageFromGroupMt}
                    chosenMessageIds={chosenMessageIdsFromGroup}
                    clearChosen={groupChat.clearChosenMessageFromGroupMt}
                    deleteAll={groupChat.deleteAllMessagesFromGroupMt}
                    deleteChosen={groupChat.deleteChosenMessagesFromGroupMt}
                />
            )}
            <div className="flex flex-col md:w-2/5 h-full px-2.5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {groupProfile.showJoinedGroup.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : groupProfile.showJoinedGroup.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {groupProfile.showJoinedGroup.error.message}
                        </div>
                    </div>
                ) : (
                    <GroupList
                        fetchNextPage={groupProfile.showJoinedGroup.fetchNextPage}
                        hasNextPage={groupProfile.showJoinedGroup.hasNextPage}
                        isFetchingNextPage={groupProfile.showJoinedGroup.isFetchingNextPage}
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                        groups={groupProfile.showJoinedGroup.data ? groupProfile.showJoinedGroup.data.pages.flat() : []}
                    />
                )}
            </div>
            {groupId ? (
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