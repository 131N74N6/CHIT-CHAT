import useUserProfileService from "./service";
import Loading from "../components/Loading";
import cn from "../utils/cn";
import { MessageCircle, X } from "lucide-react";
import { useUserChatStore } from "../user_chats/store";
import { useUserStore } from "./store";
import type { IUserProfilePopUp } from "./model";

export default function UserProfilePopUp(props: IUserProfilePopUp) {
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);

    const userProfile = useUserProfileService();

    const closeUserChatPopUp = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    const seeUserChat = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(true);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(true);
    }

    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
            <div className="flex md:w-2/5 w-full flex-col h-full border border-gray-400">
                {props.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : props.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {props.error.message}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col gap-2.5 h-full p-2.5 inset-shadow-sm inset-shadow-gray-400">
                        <div className="flex gap-2">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={seeUserChat}
                                type="button"
                            >
                                <MessageCircle size={16}/>
                            </button>
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={closeUserChatPopUp}
                                type="button"
                            >
                                <X size={16}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {props.image_public_id ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={props.image_public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={props.image}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-purple-400 text-white font-medium text-2xl text-[1.2rem]",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {userProfile.showOtherUser.data?.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">User ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props._id}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">name</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.name}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.gender}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Address</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.address}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
