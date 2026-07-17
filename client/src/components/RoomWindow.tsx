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
                    createdAt={props.createdAt}
                    deleteRoomMt={props.deleteRoomMt}
                    description={props.description}
                    isProcessing={props.isProcessing}
                    isRoomOwner={props.currentUserId === props.roomId}
                    isRoomProfileLoading={props.isLoading}
                    leftRoomMt={props.leftRoomMt}
                    roomId={props.roomId}
                    roomName={props.roomName}
                    roomProfileError={props.roomProfileError}
                    roomProfilePicture={props.roomProfilePicture}
                    seeMember={seeMember}
                    seeRoomChat={seeRoomChat}
                />
            ) : props.showMember ? (
                
                <RoomMemberWindow
                    fetchNextUser={props.fetchNextUser}
                    isRoomMemberFetchNextPage={props.isRoomMemberFetchNextPage}
                    isRoomMemberLoading={props.isLoading}
                    roomMemberError={props.roomMemberError}
                    roomMemberHaveNextPage={props.roomMemberHaveNextPage}
                    seeProfile={seeProfile}
                    users={props.users}
                />
            ) : (
                <RoomChatWindow
                    currentUserId={props.currentUserId}
                    fetchNextRoomChat={props.fetchNextRoomChat}
                    hasNextRoomChat={props.hasNextRoomChat}
                    isFetchingNextRoomChat={props.isFetchingNextRoomChat}
                    isProcessing={props.isProcessing}
                    isRoomChatLoading={props.isLoading}
                    navigate={navigate}
                    onClearOne={props.onClearOne}
                    onDeleteOne={props.onDeleteOne}
                    onDeleteOnePermanent={props.onDeleteOnePermanent}
                    roomChatError={props.roomChatError}
                    roomChats={props.roomChats}
                    roomName={props.roomName}
                    roomProfilePicture={props.roomProfilePicture}
                    seeProfile={seeProfile}
                    sendChatToRoom={props.sendChatToRoom}
                />
            )}
        </div>
    );
}