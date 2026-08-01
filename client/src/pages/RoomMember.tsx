import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import UserList from "../components/UserList";
import useSocketIo from "../hooks/useSocketIo";
import useRoomMemberService from "../services/useRoomMemberService";
import cn from "../utils/cn";
import useUserProfileService from "../services/useUserProfileService";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import { MessageCircle } from "lucide-react";
import { useRoomStore } from "../stores/room.store";
import { useChatStore } from "../stores/chat.store";

export default function RoomMember() {
    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { currentUser } = useUserProfileService();
    const { currentRoomMember, isOwnData, isRoomOwner, kickMemberMt } = useRoomMemberService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        const savedRoomId = localStorage.getItem("room_id");
        if (savedRoomId && !roomId) setRoomId(savedRoomId);
    }, []); 

    useEffect(() => {
        if (roomId) {
            localStorage.setItem("room_id", roomId);
        } else {
            localStorage.removeItem("room_id");
        }
    }, [roomId]);
    
    useSocketIo({
        identifier: ["room-member"]
    });

    return (
        <section className="flex flex-col md:flex-row gap-2.5 p-2.5 h-dvh relative z-10">
            <Navbar isProcessing={currentRoomMember.isRoomMemberLoading}/>
            {message ? <Alert message={message}/> : null}
            <div className="flex flex-col h-full w-full md:w-2/5 p-2.5 border border-gray-400 overflow-y-auto">
                <div className="flex">
                    <input
                        className={cn(
                            "focus:outline-none bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full"
                        )}
                        placeholder="find room member..."
                        type="text"
                    />
                </div>
                {currentRoomMember.isRoomMemberLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : currentRoomMember.roomMemberError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {currentRoomMember.roomMemberError.message}
                        </div>
                    </div>
                ) : (
                    <UserList
                        currentUserId={currentUser.user?.user_id!}
                        fetchNextUser={currentRoomMember.fetchNextRoomMember}
                        hasNextPage={currentRoomMember.roomMmeberHaveNextPage}
                        place={{ 
                            name: "room-member", 
                            isOwnData: isOwnData, 
                            isRoomOwner: isRoomOwner, 
                            kickMemberMt: kickMemberMt 
                        }}
                        isFetchingNextPage={currentRoomMember.isRoomMemberFetchNextPage}
                        isProcessing={currentRoomMember.isRoomMemberLoading}
                        users={currentRoomMember.roomMember}
                        setReceiverId={setReceiverId}
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