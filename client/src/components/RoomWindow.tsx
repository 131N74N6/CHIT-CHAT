import type { IRoomWindow } from "../models/room.model";
import { useNavigate } from "react-router-dom";
import RoomProfileWindow from "./RoomProfileWindow";
import RoomMemberWindow from "./RoomMemberWindow";
import RoomChatWindow from "./RoomChatWindow";

export default function RoomWindow(props: IRoomWindow) {
    const navigate = useNavigate();

    const seeProfile = () => {
        props.setShowProfile(true);
        props.setShowMember(false);
    }

    const seeMember = () => {
        props.setShowProfile(false);
        props.setShowMember(true);
    }

    const seeRoomChat = () => {
        props.setShowProfile(false);
        props.setShowMember(false);
    }

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/5 md:flex md:flex-col hidden">
            {props.showProfile ? (
                <RoomProfileWindow
                    deleteRoomMt={props.deleteRoomMt}
                    isProcessing={props.isProcessing}
                    isRoomOwner={props.currentUserId === props.roomProfile._id}
                    isRoomProfileLoading={props.isRoomProfileLoading}
                    leftRoomMt={props.leftRoomMt}
                    roomProfileError={props.roomProfileError}
                    seeMember={seeMember}
                    seeRoomChat={seeRoomChat}
                    roomProfile={props.roomProfile}
                />
            ) : props.showMember ? (
                <RoomMemberWindow
                    fetchNextUser={props.fetchNextUser}
                    isRoomMemberFetchNextPage={props.isRoomMemberFetchNextPage}
                    isRoomMemberLoading={props.isRoomMemberLoading}
                    roomMemberError={props.roomMemberError}
                    roomMemberHaveNextPage={props.roomMemberHaveNextPage}
                    seeProfile={seeProfile}
                    users={props.users}
                />
            ) : (
                <RoomChatWindow
                    clearChatsIdsSelection={props.clearChatsIdsSelection}
                    currentUserId={props.currentUserId}
                    fetchNextRoomChat={props.fetchNextRoomChat}
                    hasNextRoomChat={props.hasNextRoomChat}
                    isFetchingNextRoomChat={props.isFetchingNextRoomChat}
                    isProcessing={props.isProcessing}
                    isRoomChatLoading={props.isRoomChatLoading}
                    isSelectMode={props.isSelectMode}
                    navigate={navigate}
                    selectedIds={props.selectedChatsIds}
                    roomChatError={props.roomChatError}
                    roomChats={props.roomChats}
                    roomId={props.roomId}
                    roomProfile={props.roomProfile}
                    seeProfile={seeProfile}
                    setText={props.setText}
                    sendChatToRoom={props.sendChatToRoom}
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