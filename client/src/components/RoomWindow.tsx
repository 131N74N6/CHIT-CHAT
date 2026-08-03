import type { IRoomWindow } from "../models/room.model";
import RoomProfileWindow from "./RoomProfileWindow";
import RoomMemberWindow from "./RoomMemberWindow";
import RoomChatWindow from "./RoomChatWindow";
import RoomMediaPreviewWindow from "./RoomMediaPreviewWindow";
import RoomMediaDetailWindow from "./RoomMediaDetailWindow";

export default function RoomWindow(props: IRoomWindow) {
    const seeProfile = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowRoomMedia(false);
        props.setShowProfile(true);
        props.setShowMember(false);
    }

    const seeMedia = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowRoomMedia(true);
        props.setShowProfile(false);
        props.setShowMember(false);
    }

    const seeMember = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowProfile(false);
        props.setShowRoomMedia(false);
        props.setShowMember(true);
    }

    const seeRoomChat = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowRoomMedia(false);
        props.setShowProfile(false);
        props.setShowMember(false);
    }

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/5 md:flex md:flex-col hidden">
            {props.showProfile ? (
                <RoomProfileWindow
                    changeRoomMt={props.changeRoomMt}
                    deleteRoomMt={props.deleteRoomMt}
                    description={props.description}
                    editMode={props.editMode}
                    fileInputRef={props.fileInputRef}
                    handleImagePreview={props.handleImagePreview}
                    isRoomProfileProcessing={props.isRoomProfileProcessing}
                    isRoomOwner={props.currentUserId === props.roomProfile.creator_id}
                    isRoomProfileLoading={props.isRoomProfileLoading}
                    leftRoomMt={props.leftRoomMt}
                    oldRoomPicture={props.oldRoomPicture}
                    roomName={props.roomName}
                    roomProfileError={props.roomProfileError}
                    seeMember={seeMember}
                    seeRoomChat={seeRoomChat}
                    selectedProfileRoom={props.selectedProfileRoom}
                    selectedProfileRoomUrl={props.selectedProfileRoomUrl}
                    setDeleteRoomImage={props.setDeleteRoomImage}
                    setDescription={props.setDescription}
                    setEditMode={props.setEditMode}
                    setOldRoomPicture={props.setOldRoomPicture}
                    setRoomName={props.setRoomName}
                    setSelectedProfileRoom={props.setSelectedProfileRoom}
                    setSelectedProfileRoomUrl={props.setSelectedProfileRoomUrl}
                    roomProfile={props.roomProfile}
                />
            ) : props.showMember ? (
                <RoomMemberWindow
                    currentUserId={props.currentUserId}
                    fetchNextUser={props.fetchNextUser}
                    isRoomMemberFetchNextPage={props.isRoomMemberFetchNextPage}
                    isRoomMemberLoading={props.isRoomMemberLoading}
                    isRoomOwner={props.isRoomOwner}
                    roomMemberError={props.roomMemberError}
                    kickMemberMt={props.kickMemberMt}
                    roomMemberHaveNextPage={props.roomMemberHaveNextPage}
                    seeProfile={seeProfile}
                    setReceiverId={props.setReceiverId}
                    users={props.users}
                />
            ) : props.showRoomMedia ? (
                <RoomMediaPreviewWindow
                    handleMediaPreview={props.handleMediaPreview}
                    inputMediaRef={props.inputMediaRef}
                    isRoomChatProcessing={props.isRoomChatProcessing}
                    media={props.media}
                    removeOnePreviewFile={props.removeOnePreviewFile}
                    seeChat={seeRoomChat}
                    sendChatToRoomMt={props.sendChatToRoom}
                    setText={props.setText}
                    text={props.text}
                />
            ) : props.chatId && props.chatId !== "" ? (
                <RoomMediaDetailWindow
                    isRoomChatProcessing={props.isRoomChatProcessing}
                    roomChatMedia={props.roomChatMedia}
                    seeRoomChat={seeRoomChat}
                />
            ) : (
                <RoomChatWindow
                    clearChatsIdsSelection={props.clearChatsIdsSelection}
                    currentUserId={props.currentUserId}
                    fetchNextRoomChat={props.fetchNextRoomChat}
                    hasNextRoomChat={props.hasNextRoomChat}
                    isFetchingNextRoomChat={props.isFetchingNextRoomChat}
                    isRoomChatLoading={props.isRoomChatLoading}
                    isRoomChatProcessing={props.isRoomChatProcessing}
                    isSelectMode={props.isSelectMode}
                    seeMedia={seeMedia}
                    selectedIds={props.selectedChatsIds}
                    roomChatError={props.roomChatError}
                    roomChats={props.roomChats}
                    roomId={props.roomId}
                    roomProfile={props.roomProfile}
                    seeProfile={seeProfile}
                    setText={props.setText}
                    sendChatToRoom={props.sendChatToRoom}
                    setChatId={props.setChatId}
                    setIsSelectMode={props.setIsSelectMode}
                    setReceiverId={props.setReceiverId}
                    setRoomId={props.setRoomId}
                    setShowDeleteOption1={props.setShowDeleteOption1}
                    setShowDeleteOption2={props.setShowDeleteOption2}
                    text={props.text}
                    toggleSelect={props.toggleSelect}
                />
            )}
        </div>
    );
}