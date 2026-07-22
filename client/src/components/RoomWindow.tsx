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
        <div className="h-full flex-col gap-2.5 md:w-2/4 md:flex md:p-2.5 md:flex-col hidden">
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
                    roomProfile={props.roomProfile}
                    seeProfile={seeProfile}
                    sendChatToRoom={props.sendChatToRoom}
                    setIsSelectMode={props.setIsSelectMode}
                    setShowDeleteOption2={props.setShowDeleteOption2}
                    toggleSelect={props.toggleSelect}
                />
            )}
        </div>
    );
}