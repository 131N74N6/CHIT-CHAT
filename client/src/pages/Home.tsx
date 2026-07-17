import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import userChatService from "../services/user_chat.service";
import UserList from "../components/UserList";
import UserServices from "../services/user.service";
import UserWindow from "../components/UserWindow";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useChatStore } from "../stores/chat.store";
import userProfileService from "../services/user_profile.service";

export default function Home() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const address = useChatStore((state) => state.address);
    const setAddress = useChatStore((state) => state.setAddress);

    const createdAt = useChatStore((state) => state.createdAt);
    const setCreatedAt = useChatStore((state) => state.setCreatedAt);

    const gender = useChatStore((state) => state.gender);
    const setGender = useChatStore((state) => state.setGender);

    const name = useChatStore((state) => state.name);
    const setName = useChatStore((state) => state.setName);

    const profilePicture = useChatStore((state) => state.profilePicture);
    const setProfilePicture = useChatStore((state) => state.setProfilePicture);
    
    const receiverId = useChatStore((state) => state.receiverId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);
    
    const showUserProfile = useChatStore((state) => state.showUserProfile);
    const setShowUserProfile = useChatStore((state) => state.setShowUserProfile);

    const { 
        allUsers, 
        currentUser, 
        isUserProcessing 
    } = UserServices({ setMessage: setMessage });

    const { currentUserProfile } = userProfileService({ receiverId: receiverId });

    const { 
        clearChatForMeMt, 
        deleteChatForUserMt, 
        deleteChatPermanentlyForUserMt, 
        isUserChatProcessing, 
        sendChatToUserMt,
        userChats 
    } = userChatService({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row gap-2.5 flex-col h-screen relative z-10">
            <Navbar isProcessing={isUserChatProcessing || isUserProcessing}/>
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
                        isProcessing={isUserChatProcessing || isUserProcessing}
                        isFetchingNextPage={allUsers.isFetchNextUser}
                        setAddress={setAddress}
                        setCreatedAt={setCreatedAt}
                        setGender={setGender}
                        setProfilePicture={setProfilePicture}
                        setReceiverId={setReceiverId}
                        setUserName={setName}
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
                    profilePicture={profilePicture}
                    receiverId={receiverId}
                    sendChatToUser={sendChatToUserMt}
                    setShowUserProfile={setShowUserProfile}
                    showUserProfile={showUserProfile}
                    userChatError={userChats.error}
                    userChats={userChats.getUserChats}
                    userProfile={currentUser.user!}
                    username={name}
                />
            ) : (
                <div className="md:flex md:justify-center md:items-center md:h-full md:bg-white hidden">
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-500 font-medium flex justify-center"><MessageCircle size={34}/></div>
                        <div className="text-gray-700 font-medium text-center">
                            Welcome to Chit Chat
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}