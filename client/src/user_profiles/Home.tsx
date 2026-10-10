import Loading from "../loading/Loading";
import Navbar from "../navbar/Navbar";
import useUserChatService from "../user_chats/service";
import UserList from "./UserList";
import useUserProfileService from "./service";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useUserChatStore } from "../user_chats/store";
import Alert from "../components/Alert";
import PopUpOption from "../user_chats/PopUpOption";
import { useUserStore } from "./store";
import UserChatPopUp from "../user_chats/UserChatPopUp";
import cn from "../utils/cn";
import UserProfilePopUp from "./UserProfilePopUp";
import UserChatFilesPreviewPopUp from "../user_chats/UserChatFilesPreviewPopUp";
import UserChatFilesPopUp from "../user_chats/UserChatFilesPopUp";

export default function Home() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const openPopUpOption = useUserChatStore((state) => state.openPopUpOption);
    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);

    const showUserChatPopUp = useUserChatStore((state) => state.showUserChatPopUp);
    
    const showUserMedia = useUserChatStore((state) => state.showUserMedia);
    const showUserChatFilesPopUp = useUserChatStore((state) => state.showUserChatFilesPopUp);
    
    const receiverId = useUserChatStore((state) => state.receiverId);

    const showUserProfilePopUp = useUserStore((state) => state.showUserProfilePopUp);

    const userChat = useUserChatService();
    const userProfile = useUserProfileService();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col h-dvh relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={userProfile.isProcessing || userChat.isProcessing}/>
            {!openPopUpOption ? null : (
                <PopUpOption
                    isProcessing={userChat.isProcessing || userProfile.isProcessing}
                    clearAll={userChat.clearAllMessagesMt}
                    chosenMessageIds={chosenMessageIds}
                    clearChosen={userChat.clearChosenMessagesMt}
                    deleteAll={userChat.deleteAllMessagesMt}
                    deleteChosen={userChat.deleteChosenMessagesMt}
                />
            )}
            <div className="md:w-2/5 w-full h-full flex flex-col px-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {userProfile.showUsers.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {userProfile.showUsers.error.message}
                        </div>
                    </div>
                ) : userProfile.showUsers.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : (
                    <UserList 
                        fetchNextUser={userProfile.showUsers.fetchNextPage}
                        hasNextPage={userProfile.showUsers.hasNextPage}
                        isProcessing={userProfile.isProcessing || userChat.isProcessing}
                        isFetchingNextPage={userProfile.showUsers.isFetchingNextPage}
                        place={{ name: "user-list-home" }}
                        users={userProfile.showUsers.data ? userProfile.showUsers.data.pages.flat() : []}
                    />
                )}
            </div>
            {receiverId && receiverId !== "" ? (
                <>
                    {showUserChatPopUp ? (
                        <UserChatPopUp isProcessing={userChat.isProcessing || userProfile.isProcessing} 
                            userChat={{
                                data: userChat.showAllUserChats.data ? 
                                userChat.showAllUserChats.data.pages.flatMap(page => page).reverse() : [],

                                error: userChat.showAllUserChats.error,
                                fetchNextPage: userChat.showAllUserChats.fetchNextPage,
                                hasNextPage: userChat.showAllUserChats.hasNextPage,
                                isFetchingNextPage: userChat.showAllUserChats.isFetchingNextPage,
                                isLoading: userChat.showAllUserChats.isLoading
                            }} 
                            userProfile={{
                                error: userProfile.showOtherUser.error,
                                image: userProfile.showOtherUser.data ? userProfile.showOtherUser.data.image : "-",
                                image_public_id: userProfile.showOtherUser.data ? userProfile.showOtherUser.data.image_public_id : "-",
                                isLoading: userProfile.showOtherUser.isLoading,
                                name: userProfile.showOtherUser.data ? userProfile.showOtherUser.data.name : "-"
                            }}
                        />
                    ) : null}
                    {showUserProfilePopUp ? (
                        <UserProfilePopUp 
                            _id={userProfile.showOtherUser.data ? userProfile.showOtherUser.data._id : "-"}
                            address={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.address : "-"}
                            description={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.description : "-"}
                            error={userProfile.showOtherUser.error}
                            gender={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.gender : "-"}
                            isLoading={userProfile.showOtherUser.isLoading}
                            image={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.image : "-"}
                            image_public_id={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.image_public_id : "-"}
                            name={userProfile.showOtherUser.data ? userProfile.showOtherUser.data.name : "-"} 
                        />
                    ) : null}
                    {showUserMedia ? (
                        <UserChatFilesPreviewPopUp 
                            handleMediaPreview={userChat.handleMediaPreview} 
                            isProcessing={userChat.isProcessing || userProfile.isProcessing} 
                            inputMediaRef={userChat.inputMediaRef} 
                            sendMessageMt={userChat.sendMessageMt}
                        />
                    ) : null}
                    {showUserChatFilesPopUp ? (
                        <UserChatFilesPopUp 
                            error={userChat.showChosenMessageFiles.error} 
                            files={userChat.showChosenMessageFiles.data ? userChat.showChosenMessageFiles.data.files : []} 
                            isProcessing={userChat.isProcessing || userProfile.isProcessing} 
                            isLoading={userChat.showChosenMessageFiles.isLoading}/>
                    ) : null}
                </>
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