import ChatList from "../components/ChatList";
import useUserChatService from "../services/useUserChatService";
import cn from "../utils/cn";
import Loading from "../components/Loading";
import useUserServices from "../services/useUserProfileService";
import { File, SendIcon } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import useUserProfileService from "../services/useUserProfileService";
import Navbar from "../components/Navbar";
import useSocketIo from "../hooks/useSocketIo";

export default function UserChat() {
    const { receiver_id } = useParams();
    const navigate = useNavigate();
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { currentUser, isUserProcessing } = useUserServices({ setMessage: setMessage });

    const { currentUserProfile } = useUserProfileService({ receiverId: receiver_id });

    const { 
        clearChatForMeMt, 
        deleteChatForUserMt, 
        deleteChatPermanentlyForUserMt, 
        isUserChatProcessing, 
        sendChatToUserMt,
        setText,
        text,
        userChats 
    } = useUserChatService({ receiverId: receiver_id, setMessage: setMessage });

    useSocketIo({
        currentUserId: currentUser.user ? currentUser.user.user_id : '',
        identifier: ["user-chat"],
        marks: receiver_id ? receiver_id : ''
    });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col h-screen relative z-10 p-2.5 gap-2.5">
            <Navbar isProcessing={isUserChatProcessing || isUserProcessing || currentUserProfile.isDetailLoading}/>
            <div className="flex flex-col h-full w-full md:hidden border border-gray-400 inset-shadow-sm inset-shadow-gray-400 p-2">
                <div 
                    className="bg-gray-300 p-2 flex gap-1.5 cursor-pointer" 
                    onClick={() => navigate(`/user/profile/${receiver_id}`)}
                >
                    <div className="w-10 h-10 rounded-full">
                        {currentUserProfile.detail && currentUserProfile.detail.profile_picture !== null ? (
                            <div className="w-full h-full">
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={currentUserProfile.detail.profile_picture.url} 
                                    alt={currentUserProfile.detail.profile_picture.public_id}
                                />
                            </div>
                        ) : (
                            <div className={cn(
                                "w-full h-full rounded-full flex items-center text-[1rem]", 
                                "justify-center bg-purple-500 text-white font-medium"
                            )}>
                                {currentUserProfile.detail?.username[0]}
                            </div>
                        )}
                    </div>
                    <div className="text-gray-900 text-[1.2rem] font-medium">{currentUserProfile.detail?.username}</div>
                </div>
                <div className="flex flex-col gap-2.5 p-1 h-full">
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
                            isProcessing={isUserChatProcessing || isUserProcessing}
                            onClearOne={clearChatForMeMt}
                            onDeleteOne={deleteChatForUserMt}
                            onDeleteOnePermanent={deleteChatPermanentlyForUserMt}
                        />
                    )}
                </div>
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        sendChatToUserMt.mutate();
                    }}
                >
                    <div className="flex flex-col gap-1.5">
                        <input
                            className="focus:outline-0 outline-0 text-gray-600 font-medium w-full max-h-[25%] overflow-y-auto"
                            id="message"
                            name="message"
                            onChange={(event) => setText(event.target.value)}
                            value={text}
                            type="text"
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                className={cn(
                                    "cursor-pointer disabled:cursor-not-allowed w-10 h-10", 
                                    "text-white rounded-full flex justify-center items-center p-1.5",
                                    "bg-blue-600 transition-colors hover:bg-blue-500" 
                                )}
                                disabled={isUserChatProcessing || isUserProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className={cn(
                                    "cursor-pointer disabled:cursor-not-allowed border border-gray-400", 
                                    "border border-gray-500 bg-white text-gray-500 w-[20%] p-1.5"
                                )}
                                disabled={isUserChatProcessing || isUserProcessing}
                                onClick={() => navigate(`/user/chat/preview/${receiver_id}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}