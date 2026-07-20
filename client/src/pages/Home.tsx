import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import useUserChatService from "../services/useUserChatService";
import UserList from "../components/UserList";
import useUserServices from "../services/useUserService";
import UserWindow from "../components/UserWindow";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useChatStore } from "../stores/chat.store";
import useUserProfileService from "../services/useUserProfileService";
import useSocketIo from "../hooks/useSocketIo";
import cn from "../utils/cn";

export default function Home() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const showUserProfile = useChatStore((state) => state.showUserProfile);
    const setShowUserProfile = useChatStore((state) => state.setShowUserProfile);
    
    const showUserMedia = useChatStore((state) => state.showUserMedia);
    const setShowUserMedia = useChatStore((state) => state.setShowUserMedia);
    
    const text = useChatStore((state) => state.text);
    const setText = useChatStore((state) => state.setText);
    
    const receiverId = useChatStore((state) => state.receiverId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);

    const { 
        allUsers, 
        currentUser, 
        isUserProcessing 
    } = useUserServices({ setMessage: setMessage });

    const { currentUserProfile } = useUserProfileService({ receiverId: receiverId });

    const { 
        clearChatForMeMt, 
        deleteChatForUserMt, 
        deleteChatPermanentlyForUserMt, 
        isUserChatProcessing, 
        sendChatToUserMt,
        userChats 
    } = useUserChatService({ setMessage: setMessage, receiverId: receiverId });
        
    useSocketIo({
        currentUserId: currentUser.user ? currentUser.user.user_id : '',
        identifier: ["available-user", "user-chat", "user-profile"],
        marks: receiverId
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col h-screen relative z-10">
            <Navbar isProcessing={isUserChatProcessing || isUserProcessing}/>
            <div className="md:w-2/5 w-full h-full flex flex-col px-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400">
                {allUsers.usersError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {allUsers.usersError.message}
                        </div>
                    </div>
                ) : allUsers.isUsersLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : (
                    <UserList 
                        fetchNextUser={allUsers.fetchNextUser}
                        hasNextPage={allUsers.usersHaveNextPage}
                        isProcessing={isUserChatProcessing || isUserProcessing}
                        isFetchingNextPage={allUsers.isFetchNextUser}
                        setReceiverId={setReceiverId}
                        users={allUsers.users}
                    />
                )}
            </div>
            {receiverId ? (
                <UserWindow
                    currentUserId={currentUser.user ? currentUser.user.user_id : ""}
                    errorProfile={currentUserProfile.detailError}
                    fetchNextUserChat={userChats.fetchNextPage}
                    hasNextUserChat={userChats.hasNextPage}
                    isFetchingNextUserChats={userChats.isFetchingNextPage}
                    isProcessing={userChats.isLoading || isUserChatProcessing || isUserProcessing}
                    isProfileLoading={currentUserProfile.isDetailLoading}
                    isUserChatLoading={userChats.isLoading}
                    onClearOne={clearChatForMeMt}
                    onDeleteOne={deleteChatForUserMt}
                    onDeleteOnePermanent={deleteChatPermanentlyForUserMt}
                    receiverId={receiverId}
                    sendChatToUser={sendChatToUserMt}
                    setShowUserMedia={setShowUserMedia}
                    setShowUserProfile={setShowUserProfile}
                    setText={setText}
                    showUserMedia={showUserMedia}
                    showUserProfile={showUserProfile}
                    text={text}
                    userChatError={userChats.error}
                    userChats={userChats.getUserChats}
                    userProfile={currentUserProfile.detail!}
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