import ChatList from "./MessageList";
import useUserChatService from "./service";
import cn from "../utils/cn";
import Loading from "../components/Loading";
import { File, MessageCircle, SendIcon, Settings2 } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Alert from "../components/Alert";
import { useUserChatStore } from "./store";
import PopUpOption from "./PopUpOption";
import useUserProfileService from "../user_profiles/service";

export default function UserChat() {
    const { receiver_id } = useParams();
    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);
    const navigate = useNavigate();
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const text = useUserChatStore((state) => state.text);
    const setText = useUserChatStore((state) => state.setText);

    const chosenMessage = useUserChatStore((state) => state.chosenMessage);
    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);

    const openPopUpOption = useUserChatStore((state) => state.openPopUpOption);
    const setOpenPopUpOption = useUserChatStore((state) => state.setOpenPopUpOption);

    const receiverId = useUserChatStore((state) => state.receiverId);
    const setReceiverId = useUserChatStore((state) => state.setReceiverId);

    const resetChosenMessageIds = useUserChatStore((state) => state.resetChosenMessageIds);

    const selectMode = useUserChatStore((state) => state.selectMode);
    const setSelectMode = useUserChatStore((state) => state.setSelectMode);

    const userChat = useUserChatService();
    const user = useUserProfileService();

    useEffect(() => {
        if (receiver_id) setReceiverId(receiver_id);
    }, [receiver_id, setReceiverId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const sendMessage = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (userChat.isProcessing) return;

        if (selectMode && chosenMessage) {
            if (!text.trim() || chosenMessage.text.trim() === text.trim()) {
                setChosenMessage(null);
                setText("");
                setSelectMode(false);
                resetChosenMessageIds();
                return;
            }
            
            userChat.changeMessageMt.mutate(chosenMessage._id);
            return
        }

        userChat.sendMessageMt.mutate();
    }

    return (
        <section className="flex md:flex-row flex-col h-dvh relative z-10 p-2.5 gap-2.5">
            <Navbar isProcessing={userChat.isProcessing || user.isProcessing}/>
            {message ? <Alert message={message}/> : null}
            {!openPopUpOption ? null : (
                <PopUpOption
                    isProcessing={userChat.isProcessing || user.isProcessing}
                    clearAll={userChat.clearAllMessagesMt}
                    chosenMessageIds={chosenMessageIds}
                    clearChosen={userChat.clearChosenMessagesMt}
                    deleteAll={userChat.deleteAllMessagesMt}
                    deleteChosen={userChat.deleteChosenMessagesMt}
                />
            )}
            <main className="md:w-2/5 w-full h-full flex flex-col overflow-y-auto">
                <header className="bg-zinc-800 flex justify-between p-2.5">
                    <button 
                        className="flex-row flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                        disabled={userChat.isProcessing || user.isProcessing}
                        onClick={() => navigate(`/users/${receiverId}`)}
                        type="button"
                    >
                        {user.showOtherUser.data && user.showOtherUser.data.image_public_id ? (
                            <div className="w-8 h-8 rounded-full">
                                <img
                                    className="w-full h-full object-cover rounded-full"
                                    alt={`${user.showOtherUser.data.name}-picture`}
                                    src={user.showOtherUser.data.image}
                                />
                            </div>
                        ) : (
                            <div className="bg-amber-400 flex justify-center items-center w-8 h-8 rounded-full">
                                <p className="text-olive-800 font-medium">{user.showOtherUser.data?.name[0]}</p>
                            </div>
                        )}
                        <h3 className="text-white text-base text-left font-medium">
                            {user.showOtherUser.data?.name}
                        </h3>
                    </button>
                    <section className="flex gap-2">
                        <button 
                            className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-white"
                            disabled={userChat.isProcessing || user.isProcessing}
                            onClick={() => setOpenPopUpOption(true)}
                            type="button"
                        >
                            <Settings2 size={22}/>
                        </button>
                    </section>
                </header>
                <div className="flex flex-col gap-2.5 px-2.5 h-[80%] border-x border-gray-400">
                    {userChat.showAllUserChats.isLoading ? (
                        <div className="flex justify-center items-center bg-white h-full">
                            <Loading/>
                        </div>
                    ) : userChat.showAllUserChats.error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-700 font-medium text-center">
                                {userChat.showAllUserChats.error.message}
                            </div>
                        </div>
                    ) : (
                        <ChatList 
                            chats={userChat.showAllUserChats.data ? 
                                userChat.showAllUserChats.data.pages.flatMap(page => page).reverse() : []
                            } 
                            fetchNextPage={userChat.showAllUserChats.fetchNextPage}
                            hasNextPage={userChat.showAllUserChats.hasNextPage}
                            isFetchingNextPage={userChat.showAllUserChats.isFetchingNextPage}
                            isProcessing={userChat.isProcessing || user.isProcessing}
                        />
                    )}
                </div>
                <form 
                    className="bg-white relative h-[20%] inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={sendMessage}
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
                                disabled={userChat.isProcessing || user.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={userChat.isProcessing || user.isProcessing}
                                onClick={() => navigate(`/user/chat/preview/${receiverId}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
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