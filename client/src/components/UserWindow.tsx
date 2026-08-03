import type { IUserWindow } from "../models/user.model";
import UserChatWindow from "./UserChatWindow";
import UserMediaDetailWindow from "./UserMediaDetailWindow";
import UserMediaPreviewWindow from "./UserMediaPreviewWindow";
import UserProfileWindow from "./UserProfileWindow";

export default function UserWindow(props: IUserWindow) {
    const seeProfile = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowUserMedia(false);
        props.setShowUserProfile(true);
    }

    const seeMedia = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowUserMedia(true);
        props.setShowUserProfile(false);
    }

    const seeChat = () => {
        props.setChatId("");
        localStorage.removeItem("chat_id");
        props.setShowUserMedia(false);
        props.setShowUserProfile(false);
    }

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/5 md:flex md:flex-col hidden">
            {props.showUserProfile ? (
                <UserProfileWindow
                    errorProfile={props.errorProfile}
                    isProfileLoading={props.isProfileLoading}
                    isSelectMode={props.isSelectMode}
                    seeUserChat={seeChat}
                    userProfile={props.userProfile}
                />
            ) : props.showUserMedia ? (
                <UserMediaPreviewWindow
                    handleMediaPreview={props.handleMediaPreview}
                    inputMediaRef={props.inputMediaRef}
                    isUserChatProcessing={props.isUserChatProcessing}
                    media={props.media}
                    removeOnePreviewFile={props.removeOnePreviewFile}
                    seeChat={seeChat}
                    sendChatToUserMt={props.sendChatToUser}
                    setText={props.setText}
                    text={props.text}
                />
            ) : props.chatId && props.chatId !== "" ? (
                <UserMediaDetailWindow
                    isUserChatProcessing={props.isUserChatProcessing}
                    seeChat={seeChat}
                    userChatMedia={props.userChatMedia}
                />
            ) : (
                <UserChatWindow
                    clearSelection={props.clearSelection}
                    currentUserId={props.currentUserId}
                    fetchNextUserChat={props.fetchNextUserChat}
                    hasNextUserChat={props.hasNextUserChat}
                    isFetchingNextUserChats={props.isFetchingNextUserChats}
                    isProcessing={props.isProcessing}
                    isSelectMode={props.isSelectMode}
                    isUserChatProcessing={props.isUserChatProcessing}
                    selectedIds={props.selectedIds}
                    receiverId={props.receiverId}
                    seeMedia={seeMedia}
                    seeProfile={seeProfile}
                    sendChatToUser={props.sendChatToUser}
                    setChatId={props.setChatId}
                    setIsSelectMode={props.setIsSelectMode}
                    setReceiverId={props.setReceiverId}
                    setShowDeleteOption1={props.setShowDeleteOption1}
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