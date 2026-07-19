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
                    seeUserChat={seeChat}
                    userProfile={props.userProfile}
                />
            ) : props.showUserMedia ? (
                <UserMediaPreviewWindow/>
            ) : (
                <UserChatWindow
                    currentUserId={props.currentUserId}
                    fetchNextUserChat={props.fetchNextUserChat}
                    hasNextUserChat={props.hasNextUserChat}
                    isFetchingNextUserChats={props.isFetchingNextUserChats}
                    isProcessing={props.isProcessing}
                    isUserChatLoading={props.isUserChatLoading}
                    onClearOne={props.onClearOne}
                    onDeleteOne={props.onDeleteOne}
                    onDeleteOnePermanent={props.onDeleteOnePermanent}
                    receiverId={props.receiverId}
                    seeMedia={seeMedia}
                    seeProfile={seeProfile}
                    sendChatToUser={props.sendChatToUser}
                    setText={props.setText}
                    text={props.text}
                    userChats={props.userChats}
                    userChatError={props.userChatError}
                    userProfile={props.userProfile}
                />
            )}
        </div>
    );
}