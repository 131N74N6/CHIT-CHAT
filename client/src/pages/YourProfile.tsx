import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../services/useUserService";
import { useMessageStore } from "../stores/message.store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { MessageCircle, Pen } from "lucide-react";
import Alert from "../components/Alert";
import cn from "../utils/cn";

export default function YourProfile() {
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { currentUser, isUserProcessing } = useUserService({ setMessage: setMessage });

    const { isUserLoading, user, userError } = currentUser;

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
            <Navbar isProcessing={isUserLoading || isUserProcessing}/>
            <div className="flex md:w-2/5 w-full flex-col h-full border border-gray-400">
                {isUserLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : userError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {userError.message}
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
                                onClick={() => navigate(`/profile/edit`)}
                                type="button"
                            >
                                <Pen size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {user && user.profile_picture !== null && user.profile_picture.public_id !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={user.profile_picture.public_id}
                                            className="w-full h-full object-cover"
                                            src={user.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-purple-400 text-white font-medium text-2xl text-[1.2rem]",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {user?.username[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">User ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {user && user.user_id ? user.user_id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {user && user.username ? user.username : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {user && user.gender !== null ? user.gender : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Address</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {user && user.address ? user.address : "-"}
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