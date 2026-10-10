import { MessageCircle } from "lucide-react";
import cn from "../utils/cn";
import Navbar from "../navbar/Navbar";
import useUserChatService from "./service";
import UserChatFileList from "./UserChatFileList";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../loading/Loading";
import { useUserChatStore } from "./store";
import { useEffect } from "react";

export default function UserChatFiles() {
    const { chat_id } = useParams();
    const navigate = useNavigate();
    
    const receiverId = useUserChatStore((state) => state.receiverId);
    const setChosenMessageId = useUserChatStore((state) => state.setChosenMessageId);

    const userChat = useUserChatService();

    useEffect(() => {
        if (chat_id) setChosenMessageId(chat_id);
    }, [chat_id, setChosenMessageId]);

    return (
        <section className="h-dvh flex md:flex-row flex-col p-2.5 gap-2.5 relative z-10">
            <Navbar isProcessing={userChat.isProcessing}/>
            <main className="h-full flex flex-col w-full md:w-2/5 border border-gray-400 inset-shadow-sm inset-shadow-gray-400 overflow-y-auto">
                <div className="flex px-2.5 pt-2.5">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                        disabled={userChat.isProcessing}
                        onClick={() => navigate(`/user/chat/${receiverId}`)}
                        type="button"
                    >
                        <MessageCircle size={22}/>
                    </button>
                </div>
                {userChat.showChosenMessageFiles.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : userChat.showChosenMessageFiles.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 text-2xl font-medium text-center">{userChat.showChosenMessageFiles.error.message}</div>
                    </div>
                ) : (
                    <UserChatFileList 
                        files={userChat.showChosenMessageFiles.data? 
                            userChat.showChosenMessageFiles.data.files : []
                        } 
                        isLoading={userChat.showChosenMessageFiles.isLoading}
                    />
                )}
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