import Alert from "../components/Alert";
import cn from "../utils/cn";
import ChatList from "../components/ChatList";
import Loading from "../components/Loading";
import useRoomChatService from "../services/useRoomChatService";
import { File, Menu, MenuSquare, MessageCircle, SendIcon, X } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate, useParams } from "react-router-dom";
import useUserProfileService from "../services/useUserProfileService";
import Navbar from "../components/Navbar";
import useRoomProfileService from "../services/useRoomProfileService";
import useSocketIo from "../hooks/useSocketIo";
import RoomChatDeleteOption1 from "../components/RoomChatDeleteOption1";
import RoomChatDeleteOption2 from "../components/RoomChatDeleteOption2";

export default function RoomChat() {
    const { room_id } = useParams();
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { currentUser, isUserProfileProcessing } = useUserProfileService({ setMessage: setMessage });
    
    const { currentRoomProfile } = useRoomProfileService({ roomId: room_id });
    
    const { 
        allChatsInRoom, 
        clearAllRoomChatsForMeMt,
        clearChosenRoomChatsForMeMt,
        clearChatsIdsSelection,
        deleteAllChatsInRoomMt,
        deleteChosenChatsInRoomMt,
        isRoomChatProcessing,
        isSelectMode,
        selectedChatsIds,
        sendChatToRoomMt, 
        setIsSelectMode,
        setShowDeleteOption1,
        setShowDeleteOption2,
        setText,
        showDeleteOption1,
        showDeleteOption2,
        text,
        toggleSelect
    } = useRoomChatService({ roomId: room_id, setMessage: setMessage });
        
    useSocketIo({
        currentUserId: currentUser.user ? currentUser.user.user_id : '',
        identifier: ["room-chat", "room-profile"],
        marks: { roomId: room_id }
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
        <section className="flex md:flex-row gap-2.5 p-2.5 flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isRoomChatProcessing || isUserProfileProcessing}/>
            {showDeleteOption1 ? (
                <RoomChatDeleteOption1
                    clearAllRoomChatsForMeMt={clearAllRoomChatsForMeMt}
                    deleteAllChatsInRoomMt={deleteAllChatsInRoomMt}
                    isProcessing={isRoomChatProcessing || isUserProfileProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption1={setShowDeleteOption1}
                />
            ) : null}
            {showDeleteOption2 ? (
                <RoomChatDeleteOption2
                    clearChosenRoomChatsForMeMt={clearChosenRoomChatsForMeMt}
                    deleteChosenChatsInRoomMt={deleteChosenChatsInRoomMt}
                    clearSelection={clearChatsIdsSelection}
                    isProcessing={isRoomChatProcessing || isUserProfileProcessing}
                    setIsSelectMode={setIsSelectMode}
                    setShowDeleteOption2={setShowDeleteOption2}
                />
            ) : null}
            <div className="md:w-2/5 w-full h-full flex flex-col">
                {isSelectMode ? (
                    <div className="bg-gray-400 p-2 flex gap-1.5 cursor-pointer justify-end">
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isRoomChatProcessing || isUserProfileProcessing}
                            onClick={() => {
                                clearChatsIdsSelection();
                                setIsSelectMode(false);
                            }}
                            type="button"
                        >
                            <X size={23}/>
                        </button>
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isRoomChatProcessing || isUserProfileProcessing}
                            onClick={() => setShowDeleteOption2(true)}
                            type="button"
                        >
                            <Menu size={23}/>
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-400 p-2 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full" onClick={() => navigate(`/rooms/profile/${room_id}`)}>
                                {currentRoomProfile.detail && currentRoomProfile.detail.profile_picture !== null ? (
                                    <div className="w-full h-full">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={currentRoomProfile.detail.profile_picture.url} 
                                            alt={currentRoomProfile.detail.profile_picture.public_id}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-full h-full rounded-full flex items-center text-[0.9rem]", 
                                        "justify-center bg-purple-500 text-white font-medium"
                                    )}>
                                        {currentRoomProfile.detail?.name[0]}
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-900 text-[1.2rem] font-medium">{currentRoomProfile.detail?.name}</div>
                        </div>
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={isRoomChatProcessing || isUserProfileProcessing}
                            onClick={() => setShowDeleteOption1(true)}
                            type="button"
                        >
                            <MenuSquare size={23}/>
                        </button>
                    </div>
                )}
                <div className="flex flex-col gap-2.5 px-2.5 h-full border-x border-gray-400">
                    {allChatsInRoom.isRoomChatLoading ? (
                        <div className="flex justify-center items-center bg-white h-full">
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
                            currentUserId={currentUser.user ? currentUser.user.user_id : ''} 
                            fetchNextPage={allChatsInRoom.fecthNextRoomChat}
                            hasNextPage={allChatsInRoom.roomChatHasNextPage}
                            isFetchingNextPage={allChatsInRoom.isRoomChatFetchNext}
                            isInRoom={true}
                            isProcessing={isRoomChatProcessing || isUserProfileProcessing}
                            isSelectMode={isSelectMode}
                            selectedIds={selectedChatsIds}
                            toggleSelect={toggleSelect}
                        />
                    )}
                </div>
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        sendChatToRoomMt.mutate();
                    }}
                >
                    <div className="flex gap-1.5">
                        <textarea
                            className="focus:outline-0 w-[90%] resize-none"
                            id="message"
                            name="message"
                            onChange={(event) => setText(event.target.value)}
                            value={text}
                        />
                        <div className="flex flex-col gap-2 justify-center">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isRoomChatProcessing || isUserProfileProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isRoomChatProcessing || isUserProfileProcessing}
                                onClick={() => navigate(`/rooms/chat/preview/${room_id}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
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