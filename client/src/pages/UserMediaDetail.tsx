import { MessageCircle } from "lucide-react";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import useUserChatService from "../services/useUserChatService";
import FileDetail from "../components/FileDetail";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../stores/chat.store";

export default function UserMediaDetail() {
    const navigate = useNavigate();
    const receiverId = useChatStore((state) => state.receiverId);
    const { isUserChatProcessing, userChats } = useUserChatService();

    return (
        <section className="h-dvh flex md:flex-row flex-col p-2.5 gap-2.5 relative z-10">
            <Navbar isProcessing={isUserChatProcessing}/>
            <div className="h-full flex flex-col w-full md:w-2/5 border border-gray-400 inset-shadow-sm inset-shadow-gray-400">
                <div className="flex px-2.5 pt-2.5">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                        disabled={isUserChatProcessing}
                        onClick={() => navigate(`/user/chat/${receiverId}`)}
                        type="button"
                    >
                        <MessageCircle size={22}/>
                    </button>
                </div>
                <FileDetail files={userChats.getUserChats[0].media} is_processing={isUserChatProcessing}/>
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