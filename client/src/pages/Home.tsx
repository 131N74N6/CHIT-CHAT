import { useEffect } from "react";
import Loading from "../components/Loading";
import UserList from "../components/UserList";
import ChatServices from "../services/chat.service";
import UserServices from "../services/user.service";
import { useMessageStore } from "../stores/message.store";
import Navbar from "../components/Navbar";
import UserChatWindow from "../components/UserChatWindow";
import { useWindowStore } from "../stores/window.store";

export default function Home() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const profilePicture = useWindowStore((state) => state.profilePicture);
    const setProfilePicture = useWindowStore((state) => state.setProfilePicture);
    
    const receiverId = useWindowStore((state) => state.receiverId);
    const setReceiverId = useWindowStore((state) => state.setReceiverId);

    const username = useWindowStore((state) => state.username);
    const setUserName = useWindowStore((state) => state.setUserName);

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
                        setProfilePicture={setProfilePicture}
                        setReceiverId={setReceiverId}
                        setUserName={setUserName}
                        users={allUsers.users}
                    />
                )}
            </div>
            <UserChatWindow
                chats={userChats.getUserChats}
                currentUserId={currentUser.user ? currentUser.user.user_id : ''}
                error={userChats.error}
                fetchNextPage={userChats.fetchNextPage}
                hasNextPage={userChats.hasNextPage}
                isFetchingNextPage={userChats.isFetchingNextPage}
                isLoading={userChats.isLoading}
                isProcessing={isChatProcessing || isUserProcessing}
                onClearOne={clearChatForMeMt}
                onDeleteOne={deleteChatForReceiverMt}
                onDeleteOnePermanent={deleteChatPermanentlyForReceiverMt}
                profilePicture={profilePicture}
                receiverId={receiverId}
                username={username}
            />
            <Navbar isProcessing={isChatProcessing || isUserProcessing}/>
        </section>
    );
}