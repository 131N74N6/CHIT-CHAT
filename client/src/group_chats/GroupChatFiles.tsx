import { MessageCircle } from "lucide-react";
import UserChatFileList from "../user_chats/UserChatFileList";
import Navbar from "../navbar/Navbar";
import cn from "../utils/cn";
import { useNavigate, useParams } from "react-router-dom";
import useGroupChatService from "./service";
import { useGroupChatStore } from "./store";
import { useEffect } from "react";
import Loading from "../components/Loading";

export default function GroupChatFiles() {
    const { chat_id } = useParams();
    const navigate = useNavigate();

    const groupId = useGroupChatStore((state) => state.groupId);
    const setGroupMessageId = useGroupChatStore((state) => state.setGroupMessageId);

    const groupChat = useGroupChatService();

    useEffect(() => {
        if (chat_id) setGroupMessageId(chat_id);
    }, [chat_id, setGroupMessageId]);

    return (
        <section className="h-dvh flex md:flex-row flex-col p-2.5 gap-2.5 relative z-10">
            <Navbar isProcessing={groupChat.isProcessing}/>
            <div className="h-full flex flex-col w-full md:w-2/5 border border-gray-400 inset-shadow-sm inset-shadow-gray-400">
                <div className="flex px-2.5 pt-2.5">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                        disabled={groupChat.isProcessing}
                        onClick={() => navigate(`/rooms/chat/${groupId}`)}
                        type="button"
                    >
                        <MessageCircle size={22}/>
                    </button>
                </div>
                {groupChat.showFilesThatSentToGroup.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {groupChat.showFilesThatSentToGroup.error.message}
                        </div>
                    </div>
                ) : groupChat.showAllGroupMessages.isLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : (
                    <UserChatFileList 
                        files={groupChat.showFilesThatSentToGroup.data ? groupChat.showFilesThatSentToGroup.data.files : []} 
                        isLoading={groupChat.showFilesThatSentToGroup.isLoading}
                    />
                )}
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