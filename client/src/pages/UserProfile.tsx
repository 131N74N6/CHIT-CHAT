import useUserProfileService from "../services/useUserProfileService";
import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, MessageCircle } from "lucide-react";
import useSocketIo from "../hooks/useSocketIo";
import { useChatStore } from "../stores/chat.store";

export default function UserProfile() {
    const navigate = useNavigate();
    const receiverId = useChatStore((state) => state.receiverId);
    const setReceiverId = useChatStore((state) => state.setReceiverId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { receiverUserProfile } = useUserProfileService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        const savedReceiverId = localStorage.getItem("receiver_id");
        if (savedReceiverId && !receiverId) setReceiverId(savedReceiverId);
    }, []); 

    useEffect(() => {
        if (receiverId) {
            localStorage.setItem("receiver_id", receiverId);
        } else {
            localStorage.removeItem("receiver_id");
        }
    }, [receiverId]);

    useSocketIo({
        identifier: ["user-profile"]
    });

    return (
        <section className="flex md:flex-row gap-2.5 p-2.5 flex-col relative h-dvh z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar/>
            <div className="flex md:w-2/5 w-full flex-col h-full border border-gray-400">
                {receiverUserProfile.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : receiverUserProfile.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {receiverUserProfile.error.message}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col gap-2.5 h-full p-2.5 inset-shadow-sm inset-shadow-gray-400">
                        <div className="flex gap-1.5">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/user/chat/${receiverId}`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {receiverUserProfile.data && receiverUserProfile.data.profile_picture && receiverUserProfile.data.profile_picture.public_id ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={receiverUserProfile.data.profile_picture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={receiverUserProfile.data.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-purple-400 text-white font-medium text-2xl text-[1.2rem]",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {receiverUserProfile.data?.username[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">User ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {receiverUserProfile.data && receiverUserProfile.data._id ? receiverUserProfile.data._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {receiverUserProfile.data && receiverUserProfile.data.username ? receiverUserProfile.data.username : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {receiverUserProfile.data && receiverUserProfile.data.gender ? receiverUserProfile.data.gender : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Address</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {receiverUserProfile.data && receiverUserProfile.data.address ? receiverUserProfile.data.address : "-"}
                                </div>
                            </div>
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