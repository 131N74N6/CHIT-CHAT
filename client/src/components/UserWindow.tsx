import type { IUserWindow } from "../models/user.model";
import UserChatWindow from "./UserChatWindow";
import UserMediaPreviewWindow from "./UserMediaPreviewWindow";
import UserProfileWindow from "./UserProfileWindow";

export default function UserWindow(props: IUserWindow) {
    const seeProfile = () => {
        props.setShowUserMedia(false);
        props.setShowUserProfile(true);
    }

    const seeMedia = () => {
        props.setShowUserMedia(true);
        props.setShowUserProfile(false);
    }

    const seeChat = () => {
        props.setShowUserMedia(false);
        props.setShowUserProfile(false);
    }

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/5 md:flex md:p-2.5 md:flex-col hidden inset-shadow-sm inset-shadow-gray-400">
            {props.showUserProfile ? (
                <UserProfileWindow
                    errorProfile={props.errorProfile}
                    isProfileLoading={props.isProfileLoading}
                    isSelectMode={props.isSelectMode}
                    seeUserChat={seeChat}
                    userProfile={props.userProfile}
                />
            ) : props.showUserMedia ? (
                <UserMediaPreviewWindow/>
            ) : (
                <UserChatWindow
                    clearSelection={props.clearSelection}
                    currentUserId={props.currentUserId}
                    fetchNextUserChat={props.fetchNextUserChat}
                    hasNextUserChat={props.hasNextUserChat}
                    isFetchingNextUserChats={props.isFetchingNextUserChats}
                    isProcessing={props.isProcessing}
                    isSelectMode={props.isSelectMode}
                    isUserChatLoading={props.isUserChatLoading}
                    selectedIds={props.selectedIds}
                    receiverId={props.receiverId}
                    seeMedia={seeMedia}
                    seeProfile={seeProfile}
                    sendChatToUser={props.sendChatToUser}
                    setIsSelectMode={props.setIsSelectMode}
                    setShowDeleteOption2={props.setShowDeleteOption2}
                    setText={props.setText}
                    text={props.text}
                    toggleSelect={props.toggleSelect}
                    userChats={props.userChats}
                    userChatError={props.userChatError}
                    userProfile={props.userProfile}
                />
            )}
        </div>
    );
}