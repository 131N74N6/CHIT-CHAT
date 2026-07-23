import Alert from "../components/Alert";
import cn from "../utils/cn";
import useRoomProfileService from "../services/useRoomProfileService";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, MessageCircle } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useUserProfileService from "../services/useUserProfileService";
import useSocketIo from "../hooks/useSocketIo";
import useRoomMemberService from "../services/useRoomMemberService";

export default function RoomProfile() {
    const { room_id } = useParams();
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { currentUser, isUserProfileProcessing } = useUserProfileService({ setMessage: setMessage });
    const { user } = currentUser;

    const { currentRoomProfile,deleteRoomMt } = useRoomProfileService({ roomId: room_id });
    const { detail, errorDetail, isDetailLoading } = currentRoomProfile;

    const { leftRoomMt } = useRoomMemberService({ setMessage: setMessage, roomId: room_id });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);


    useSocketIo({
        currentUserId: currentUser.user?.user_id!,
        identifier: ["room-profile"],
        marks: { roomId: room_id }
    });

    const isRoomOwner = user && detail && user.user_id === detail.creator_id;

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserProfileProcessing}/>
            <div className="flex w-full flex-col h-full gap-2.5 p-2.5 md:w-2/5 inset-shadow-sm inset-shadow-gray-400">
                {isDetailLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : errorDetail ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {errorDetail.message}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col p-2.5 gap-2.5">
                        <div className="flex">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/rooms/chat/${room_id}`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {detail && detail.profile_picture !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={detail.profile_picture.public_id}
                                            className="w-full h-full object-cover"
                                            src={detail.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {detail?.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Created At</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.created_at ? detail.created_at : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Room ID</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail._id ? detail._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Username</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.name ? detail.name : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Description</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.description !== null ? detail.description : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {isRoomOwner ? (
                                <button
                                    className={cn(
                                        "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                        "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                                    )}
                                    disabled={isUserProfileProcessing}
                                    onClick={() => deleteRoomMt.mutate()}
                                    type="button"
                                >
                                    Delete room
                                </button>
                            ) : (
                                <button
                                    className={cn(
                                        "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-red-600", 
                                        "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                                    )}
                                    disabled={isUserProfileProcessing}
                                    onClick={() => leftRoomMt.mutate()}
                                >
                                    Left room
                                </button>
                            )}
                            <button
                                className={cn(
                                    "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                                )}
                                disabled={isUserProfileProcessing}
                                type="button"
                                onClick={() => navigate(`/rooms/member/${room_id}`)}
                            >
                                See Room Member
                            </button>
                        </div>
                    </div>
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