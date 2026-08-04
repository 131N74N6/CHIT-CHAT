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

    const chatId = useChatStore((state) => state.chatId);
    const setChatId = useChatStore((state) => state.setChatId);
    
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
    } = useUserProfileService();

    const { 
        allUserChats, 
        clearAllUserChatsForMeMt, 
        clearChosenUserChatForMeMt,
        clearSelection, 
        deleteAllUserChatsMt, 
        deleteChosenUsersChatMt,
        handleMediaPreview,
        inputMediaRef,
        isSelectMode,
        isUserChatProcessing, 
        media,
        removeOnePreviewFile,
        selectedIds,
        sendChatToUserMt,
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        showDeleteOption1,
        showDeleteOption2,
        toggleSelect,
        userChatMedia
    } = useUserChatService();
    
    useSocketIo({
        identifier: ["available-user", "user-chat", "user-profile"]
    });

    useEffect(() => {
        const savedReceiverId = localStorage.getItem("receiver_id");
        if (savedReceiverId && !receiverId) setReceiverId(savedReceiverId);
    }, []); 

    useEffect(() => {
        if (receiverId) {
            localStorage.setItem("receiver_id", receiverId);
        } else {
            localStorage.removeItem("receiver_id");
        }
    }, [receiverId]);

    useEffect(() => {
        const savedUserChatId = localStorage.getItem("chat_id");
        if (savedUserChatId && !chatId) setChatId(savedUserChatId);
    }, []); 

    useEffect(() => {
        if (chatId) {
            localStorage.setItem("chat_id", chatId);
        } else {
            localStorage.removeItem("chat_id");
        }
    }, [chatId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col h-dvh relative z-10">
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
            <div className="md:w-2/5 w-full h-full flex flex-col px-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {allUsers.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {allUsers.error.message}
                        </div>
                    </div>
                ) : allUsers.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : (
                    <UserList 
                        currentUserId={currentUser.data ? currentUser.data.user_id : ""}
                        fetchNextUser={allUsers.fetchNextPage}
                        hasNextPage={allUsers.hasNextPage}
                        isProcessing={isUserChatProcessing || isUserProfileProcessing}
                        isFetchingNextPage={allUsers.isFetchingNextPage}
                        place={{ name: "user-list-home" }}
                        setReceiverId={setReceiverId}
                        users={allUsers.data ? allUsers.data.pages.flat() : []}
                    />
                )}
            </div>
            {receiverId && receiverId !== "" ? (
                <UserWindow
                    chatId={chatId}
                    clearSelection={clearSelection}
                    currentUserId={currentUser.data ? currentUser.data.user_id : ""}
                    errorProfile={receiverUserProfile.error}
                    fetchNextUserChat={allUserChats.fetchNextPage}
                    handleMediaPreview={handleMediaPreview}
                    hasNextUserChat={allUserChats.hasNextPage}
                    inputMediaRef={inputMediaRef}
                    media={media}
                    isFetchingNextUserChats={allUserChats.isFetchingNextPage}
                    isProcessing={allUserChats.isLoading || isUserChatProcessing || isUserProfileProcessing}
                    isProfileLoading={receiverUserProfile.isLoading}
                    isUserChatProcessing={isUserChatProcessing}
                    isSelectMode={isSelectMode}
                    receiverId={receiverId}
                    removeOnePreviewFile={removeOnePreviewFile}
                    selectedIds={selectedIds}
                    sendChatToUser={sendChatToUserMt}
                    setChatId={setChatId}
                    setIsSelectMode={setIsSelectMode}
                    setReceiverId={setReceiverId}
                    setShowDeleteOption1={setShowDeleteOption1}
                    setShowDeleteOption2={setShowDeleteOption2}
                    setShowUserMedia={setShowUserMedia}
                    setShowUserProfile={setShowUserProfile}
                    setText={setText}
                    showUserMedia={showUserMedia}
                    showUserProfile={showUserProfile}
                    text={text}
                    toggleSelect={toggleSelect}
                    userChats={allUserChats.data ? allUserChats.data.pages.flatMap(page => page).reverse() : []}
                    userChatError={allUserChats.error}
                    userChatMedia={userChatMedia}
                    userProfile={receiverUserProfile.data!}
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