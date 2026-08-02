import ChatList from "../components/ChatList";
import useUserChatService from "../services/useUserChatService";
import cn from "../utils/cn";
import Loading from "../components/Loading";
import { File, Menu, MenuSquare, MessageCircle, SendIcon, X } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUserProfileService from "../services/useUserProfileService";
import Navbar from "../components/Navbar";
import useSocketIo from "../hooks/useSocketIo";
import Alert from "../components/Alert";
import UserChatDeleteOption1 from "../components/UserChatDeleteOption1";
import UserChatDeleteOption2 from "../components/UserChatDeleteOption2";
import { useChatStore } from "../stores/chat.store";

export default function UserChat() {
    const receiverId = useChatStore((state) => state.receiverId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);
    
    const setChatId = useChatStore((state) => state.setChatId);
    const navigate = useNavigate();
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        currentUser, 
        isUserProfileProcessing, 
        receiverUserProfile 
    } = useUserProfileService();

    const { 
        clearAllUserChatsForMeMt,
        clearChosenUserChatForMeMt,
        clearSelection,
        deleteAllUserChatsMt,
        deleteChosenUsersChatMt,
        isSelectMode,
        setIsSelectMode,
        isUserChatProcessing, 
        sendChatToUserMt,
        selectedIds,
        setText,
        showDeleteOption1,
        showDeleteOption2,
        setShowDeleteOption1,
        setShowDeleteOption2,
        text,
        toggleSelect,
        userChats 
    } = useUserChatService();

    useSocketIo({
        identifier: ["user-chat", "user-profile"]
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
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-dvh relative z-10 p-2.5 gap-2.5">
            <Navbar isProcessing={isUserChatProcessing || isUserProfileProcessing || receiverUserProfile.isDetailLoading}/>
            {message ? <Alert message={message}/> : null}
            {showDeleteOption1 ? (
                <UserChatDeleteOption1 
                    clearAllUserChatsForMeMt={clearAllUserChatsForMeMt}
                    deleteAllUserChatsMt={deleteAllUserChatsMt}
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
            <div className="md:w-2/5 w-full h-full flex flex-col overflow-y-auto">
                {isSelectMode ? (
                    <div className="bg-gray-200 p-2 flex gap-1.5 cursor-pointer justify-end border border-gray-400">
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isUserChatProcessing || isUserProfileProcessing}
                            onClick={() => {
                                clearSelection();
                                setIsSelectMode(false);
                            }}
                            type="button"
                        >
                            <X size={23}/>
                        </button>
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isUserChatProcessing || isUserProfileProcessing}
                            onClick={() => setShowDeleteOption2(true)}
                            type="button"
                        >
                            <Menu size={23}/>
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-200 p-2 flex justify-between items-center cursor-pointer border border-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full" onClick={() => navigate(`/user/profile/${receiverId}`)}>
                                {receiverUserProfile.detail && receiverUserProfile.detail.profile_picture !== null ? (
                                    <div className="w-full h-full">
                                        <img 
                                            className="w-full h-full object-cover rounded-full" 
                                            src={receiverUserProfile.detail.profile_picture.url} 
                                            alt={receiverUserProfile.detail.profile_picture.public_id}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-full h-full rounded-full flex items-center text-[0.9rem]", 
                                        "justify-center bg-purple-500 text-white font-medium"
                                    )}>
                                        {receiverUserProfile.detail?.username[0]}
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-900 text-[1.2rem] font-medium">{receiverUserProfile.detail?.username}</div>
                        </div>
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isUserChatProcessing || isUserProfileProcessing}
                            onClick={() => setShowDeleteOption1(true)}
                            type="button"
                        >
                            <MenuSquare size={23}/>
                        </button>
                    </div>
                )}
                <div className="flex flex-col gap-2.5 px-2.5 h-[80%] border-x border-gray-400">
                    {userChats.isLoading ? (
                        <div className="flex justify-center items-center bg-white h-full">
                            <Loading/>
                        </div>
                    ) : userChats.error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-700 font-medium text-center">
                                {userChats.error.message}
                            </div>
                        </div>
                    ) : (
                        <ChatList 
                            chats={userChats.getUserChats} 
                            currentUserId={currentUser.user ? currentUser.user.user_id : ''} 
                            fetchNextPage={userChats.fetchNextPage}
                            hasNextPage={userChats.hasNextPage}
                            isFetchingNextPage={userChats.isFetchingNextPage}
                            isInRoom={false}
                            isProcessing={isUserChatProcessing || isUserProfileProcessing}
                            isSelectMode={isSelectMode}
                            place={{ name: "user-chat" }}
                            selectedIds={selectedIds}
                            setChatId={setChatId}
                            toggleSelect={toggleSelect}
                        />
                    )}
                </div>
                <form 
                    className="bg-white relative h-[20%] inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        sendChatToUserMt.mutate();
                    }}
                >
                    <textarea
                        className="focus:outline-0 outline-0 w-full h-full resize-none pr-12"
                        id="message"
                        name="message"
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                    />
                    <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                        <div className="flex flex-col gap-2.5">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isUserChatProcessing || isUserProfileProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isUserChatProcessing || isUserProfileProcessing}
                                onClick={() => navigate(`/user/chat/preview/${receiverId}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
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
        </section>
    );
}