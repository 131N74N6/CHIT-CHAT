import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserServices from "../services/useUserServices";
import { useMessageStore } from "../stores/message.store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, Pen } from "lucide-react";
import Alert from "../components/Alert";
import cn from "../utils/cn";

export default function YourProfile() {
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const { currentUser, isUserProcessing } = useUserServices({ setMessage: setMessage });

    const { isUserLoading, user, userError } = currentUser;

    return (
        <section className="flex flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserLoading || isUserProcessing}/>
            <div className="flex w-full flex-col h-full p-2.5">
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
                    <div className="bg-white flex flex-col gap-2.5">
                        <div className="flex gap-1.5">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/home`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
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
                                {user && user.profile_picture !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={user.profile_picture.public_id}
                                            className="w-full h-full object-cover"
                                            src={user.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {user?.username[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">User ID</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {user && user.user_id ? user.user_id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Username</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {user && user.username ? user.username : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Gender</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {user && user.gender !== null ? user.gender : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Address</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {user && user.address ? user.address : "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}