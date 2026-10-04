import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import UserList from "../user_profiles/UserList";
import cn from "../utils/cn";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import { MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import useGroupMembers from "./service";
import { useGroupChatStore } from "../group_chats/store";

export default function GroupMember() {
    const { room_id } = useParams();
    const setGroupId = useGroupChatStore((state) => state.setGroupId);
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const groupMembers = useGroupMembers();

    useEffect(() => {
        if (room_id) setGroupId(room_id);
    }, [room_id, setGroupId])
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col md:flex-row gap-2.5 p-2.5 h-dvh relative z-10">
            <Navbar isProcessing={groupMembers.isProcessing}/>
            {message ? <Alert message={message}/> : null}
            <div className="flex flex-col h-full w-full md:w-2/5 p-2.5 border border-gray-400 overflow-y-auto">
                <div className="flex">
                    <input
                        className="outline-none bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full"
                        placeholder="find room member..."
                        type="text"
                    />
                </div>
                {groupMembers.showGroupMembers.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : groupMembers.showGroupMembers.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {groupMembers.showGroupMembers.error.message}
                        </div>
                    </div>
                ) : (
                    <UserList
                        fetchNextUser={groupMembers.showGroupMembers.fetchNextPage}
                        hasNextPage={groupMembers.showGroupMembers.hasNextPage}
                        place={{ 
                            name: "group-member", 
                            isGroupOwner: groupMembers.isGroupOwner, 
                            kickMemberMt: groupMembers.kickMemberMt 
                        }}
                        isFetchingNextPage={groupMembers.showGroupMembers.isFetchingNextPage}
                        isProcessing={groupMembers.isProcessing}
                        users={groupMembers.showGroupMembers.data ? 
                            groupMembers.showGroupMembers.data.pages.flat() : []
                        }
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
