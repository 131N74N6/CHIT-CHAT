import { useEffect } from "react";
import Loading from "../components/Loading";
import UserList from "../components/UserList";
import ChatServices from "../services/chat.service";
import UserServices from "../services/user.service";
import { useMessageStore } from "../stores/message.store";
import Navbar from "../components/Navbar";
import ChatList from "../components/ChatList";

export default function Home() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        allUsers, 
        currentUser, 
        isUserProcessing 
    } = UserServices({ setMessage: setMessage });

    const { 
        clearChatForMeMt, 
        deleteChatForReceiverMt, 
        deleteChatPermanentlyForReceiverMt, 
        isChatProcessing, 
        receiverId, 
        setReceiverId, 
        userChats 
    } = ChatServices({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row gap-2.5 flex-col h-screen relative z-10">
            <div className="md:w-2/4 w-full h-full p-2.5 flex flex-col">
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
                        isProcessing={isChatProcessing || isUserProcessing}
                        isFetchingNextPage={allUsers.isFetchNextUser}
                        setReceiverId={setReceiverId}
                        users={allUsers.users}
                    />
                )}
            </div>
            <div className="md:w-2/4 md:flex hidden h-full md:p-2.5 md:flex-col bg-blue-300">
                {receiverId ? (
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
                ) : userChats.isLoading ? (
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
                    <div className="flex justify-center items-center h-full bg-white">
                        <div className="text-gray-700 font-medium text-center">
                            Welcome...
                        </div>
                    </div>
                )}
            </div>
            <Navbar isProcessing={isChatProcessing || isUserProcessing}/>
        </section>
    );
}