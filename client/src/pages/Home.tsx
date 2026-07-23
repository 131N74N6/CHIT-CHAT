import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import useUserChatService from "../services/useUserChatService";
import UserList from "../components/UserList";
import useUserProfileService from "../services/useUserProfileService";
import UserWindow from "../components/UserWindow";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useChatStore } from "../stores/chat.store";
import useSocketIo from "../hooks/useSocketIo";
import cn from "../utils/cn";
import Alert from "../components/Alert";
import UserChatDeleteOption1 from "../components/UserChatDeleteOption1";
import UserChatDeleteOption2 from "../components/UserChatDeleteOption2";

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
        isUserProfileProcessing, 
        receiverUserProfile 
    } = useUserProfileService({ receiverId: receiverId, setMessage: setMessage });

    const { 
        clearAllUserChatsForMeMt, 
        clearChosenUserChatForMeMt,
        clearSelection, 
        deleteAllUserChatsMt, 
        deleteChosenUsersChatMt,
        isSelectMode,
        isUserChatProcessing, 
        selectedIds,
        sendChatToUserMt,
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        showDeleteOption1,
        showDeleteOption2,
        toggleSelect,
        userChats 
    } = useUserChatService({ setMessage: setMessage, receiverId: receiverId });
    
    useSocketIo({
        currentUserId: currentUser.user ? currentUser.user.user_id : '',
        identifier: ["available-user", "user-chat", "user-profile"],
        marks: { receiverId: receiverId }
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col h-screen relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserChatProcessing || isUserProfileProcessing}/>
            {showDeleteOption1 ? (
                <UserChatDeleteOption1
                    deleteAllUserChatsMt={deleteAllUserChatsMt}
                    clearAllUserChatsForMeMt={clearAllUserChatsForMeMt}
                    isProcessing={isUserChatProcessing || isUserProfileProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption1={setShowDeleteOption1}
                />
            ) : null}
            {showDeleteOption2 ? (
                <UserChatDeleteOption2
                    clearChosenUserChatForMeMt={clearChosenUserChatForMeMt}
                    clearSelection={clearSelection}
                    deleteChosenUsersChatMt={deleteChosenUsersChatMt}
                    isProcessing={isUserChatProcessing || isUserProfileProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption2={setShowDeleteOption2}
                />
            ) : null}
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
                        isProcessing={isUserChatProcessing || isUserProfileProcessing}
                        isFetchingNextPage={allUsers.isFetchNextUser}
                        setReceiverId={setReceiverId}
                        users={allUsers.users}
                    />
                )}
            </div>
            {receiverId ? (
                <UserWindow
                    clearSelection={clearSelection}
                    currentUserId={currentUser.user ? currentUser.user.user_id : ""}
                    errorProfile={receiverUserProfile.detailError}
                    fetchNextUserChat={userChats.fetchNextPage}
                    hasNextUserChat={userChats.hasNextPage}
                    isFetchingNextUserChats={userChats.isFetchingNextPage}
                    isProcessing={userChats.isLoading || isUserChatProcessing || isUserProfileProcessing}
                    isProfileLoading={receiverUserProfile.isDetailLoading}
                    isUserChatLoading={userChats.isLoading}
                    isSelectMode={isSelectMode}
                    receiverId={receiverId}
                    selectedIds={selectedIds}
                    sendChatToUser={sendChatToUserMt}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption2={setShowDeleteOption2}
                    setShowUserMedia={setShowUserMedia}
                    setShowUserProfile={setShowUserProfile}
                    setText={setText}
                    showUserMedia={showUserMedia}
                    showUserProfile={showUserProfile}
                    text={text}
                    toggleSelect={toggleSelect}
                    userChatError={userChats.error}
                    userChats={userChats.getUserChats}
                    userProfile={receiverUserProfile.detail!}
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