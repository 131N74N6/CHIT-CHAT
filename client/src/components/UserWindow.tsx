import type { IUserWindow } from "../models/user.model";
import UserChatWindow from "./UserChatWindow";
import UserProfileWindow from "./UserProfileWindow";

export default function UserWindow(props: IUserWindow) {
    const seeProfile = () => props.setShowUserProfile(true);
    const seeChat = () => props.setShowUserProfile(false);

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/4 md:flex md:p-2.5 md:flex-col hidden">
            {props.showUserProfile ? (
                <UserProfileWindow
                    errorProfile={props.errorProfile}
                    isProfileLoading={props.isProfileLoading}
                    seeUserChat={seeChat}
                    userProfile={props.userProfile}
                />
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
                    profilePicture={props.profilePicture}
                    receiverId={props.receiverId}
                    seeProfile={seeProfile}
                    sendChatToUser={props.sendChatToUser}
                    userChats={props.userChats}
                    userChatError={props.userChatError}
                    username={props.username}
                />
            )}
        </div>
    );
}