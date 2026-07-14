import { useParams } from "react-router-dom";
import ChatServices from "../services/chat.service";
import { useMessageStore } from "../stores/message.store";
import UserServices from "../services/user.service";
import { useEffect } from "react";
import Loading from "../components/Loading";
import ChatList from "../components/ChatList";

export default function UserChat() {
    const { receiver_id } = useParams();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { currentUser, isUserProcessing } = UserServices({ setMessage: setMessage });

    const { 
        clearChatForMeMt, 
        deleteChatForReceiverMt, 
        deleteChatPermanentlyForReceiverMt, 
        isChatProcessing,  
        userChats 
    } = ChatServices({ receiverId: receiver_id, setMessage: setMessage });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col h-screen relative z-10">
            <div className="flex flex-col p-2.5 h-full">
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
                        isProcessing={isChatProcessing || isUserProcessing}
                        onClearOne={clearChatForMeMt}
                        onDeleteOne={deleteChatForReceiverMt}
                        onDeleteOnePermanent={deleteChatPermanentlyForReceiverMt}
                    />
                )}
            </div>
        </section>
    );
}