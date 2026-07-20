import Alert from "../components/Alert";
import cn from "../utils/cn";
import ChatList from "../components/ChatList";
import Loading from "../components/Loading";
import useRoomChatService from "../services/useRoomChatService";
import { File, SendIcon } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate, useParams } from "react-router-dom";
import useUserServices from "../services/useUserService";
import Navbar from "../components/Navbar";
import useRoomProfileService from "../services/useRoomProfileService";
import useSocketIo from "../hooks/useSocketIo";

export default function RoomChat() {
    const { room_id } = useParams();
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { currentUser, isUserProcessing } = useUserServices({ setMessage: setMessage });
    
    const { currentRoomProfile } = useRoomProfileService({ roomId: room_id });
    
    const { 
        allChatsInRoom, 
        clearChatInRoomForMeMt,
        deleteChaForRoomMt,
        deleteChatPermanentlyForRoomMt,
        isRoomChatProcessing,
        sendChatToRoomMt 
    } = useRoomChatService({ roomId: room_id, setMessage: setMessage });
        
    useSocketIo({
        currentUserId: currentUser.user ? currentUser.user.user_id : '',
        identifier: ["room-chat"],
        marks: room_id ? room_id : ''
    });


    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isRoomChatProcessing || isUserProcessing}/>
            <div className="flex flex-col h-full px-2.5 pt-2.5 w-full">
                <div className="bg-gray-500 flex gap-1.5 p-2 w-full" onClick={() => navigate(`/room/profile/${room_id}`)}>
                    <div className="w-20 h-20 rounded-full">
                        {currentRoomProfile.detail && currentRoomProfile.detail.profile_picture !== null ? (
                            <div className="w-full h-full">
                                <img
                                    className="w-full h-full object-cover"
                                    alt={currentRoomProfile.detail.profile_picture.public_id}
                                    src={currentRoomProfile.detail.profile_picture.url}
                                />
                            </div>
                        ) : (
                            <div className={cn(
                                "w-full h-full rounded-full flex items-center", 
                                "justify-center bg-blue-600 text-white font-extralight"
                            )}>
                                {currentRoomProfile.detail?.name[0]}
                            </div>
                        )}
                    </div>
                    <div className="text-white text-[1.2rem] font-extralight">{currentRoomProfile.detail?.name}</div>
                </div>
                <div className="flex flex-col gap-2.5 p-1">
                    {allChatsInRoom.isRoomChatLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading/>
                        </div>
                    ) : allChatsInRoom.roomChatsError ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-700 font-medium text-center">
                                {allChatsInRoom.roomChatsError.message}
                            </div>
                        </div>
                    ) : (
                        <ChatList
                            chats={allChatsInRoom.roomChats}
                            currentUserId={currentUser.user ? currentUser.user.user_id : ""}
                            fetchNextPage={allChatsInRoom.fecthNextRoomChat}
                            hasNextPage={allChatsInRoom.roomChatHasNextPage}
                            isFetchingNextPage={allChatsInRoom.isRoomChatFetchNext}
                            isProcessing={isRoomChatProcessing || isUserProcessing}
                            onClearOne={clearChatInRoomForMeMt}
                            onDeleteOne={deleteChaForRoomMt}
                            onDeleteOnePermanent={deleteChatPermanentlyForRoomMt}
                        />
                    )}
                    <form 
                        className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 max-h-[30%] overflow-y-auto"
                        onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            sendChatToRoomMt.mutate();
                        }}
                    >
                        <div className="flex justify-end">
                            <input
                                className="inline-0 text-gray-900 font-light w-[90%]"
                                id="message"
                                name="message"
                                type="text"
                            />
                            <button
                                className={cn(
                                    "cursor-pointer disabled:cursor-not-allowed", 
                                    "text-white rounded-full flex justify-center items-center p-1.5",
                                    "bg-blue-600 w-[10%] h-[10%] transition-colors hover:bg-blue-500" 
                                )}
                                disabled={isRoomChatProcessing || isUserProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                        </div>
                        <div>
                            <button 
                                className={cn(
                                    "cursor-pointer disabled:cursor-not-allowed", 
                                    "border border-gray-500 bg-white text-gray-500 w-[20%] p-1.5"
                                )}
                                disabled={isRoomChatProcessing || isUserProcessing}
                                onClick={() => navigate(`/room/chat/preview/${room_id}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}