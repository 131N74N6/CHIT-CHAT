import useUserProfileService from "../services/useUserProfileService";
import { useNavigate, useParams } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { ArrowBigLeft } from "lucide-react";

export default function UserProfile() {
    const { receiver_id } = useParams();
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

    const { currentUserProfile } = useUserProfileService({ receiverId: receiver_id });

    const { detail, detailError, isDetailLoading } = currentUserProfile;

    return (
        <section className="flex flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isDetailLoading}/>
            <div className="flex w-full flex-col h-full p-2.5">
                {isDetailLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : detailError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {detailError.message}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col gap-2.5">
                        <div className="flex">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/user/chat/${receiver_id}`)}
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
                                        {detail?.username[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">User ID</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail._id ? detail._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Username</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.username ? detail.username : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Gender</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.gender !== null ? detail.gender : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-xl font-medium text-gray-800">Address</div>
                                <div className="text-xl font-medium text-gray-800">
                                    {detail && detail.address ? detail.address : "-"}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}