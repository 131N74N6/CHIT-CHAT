import { MessageCircle } from "lucide-react";
import Navbar from "../navbar/Navbar";
import Loading from "../components/Loading";
import { useUserChatStore } from "./store";
import { useUserStore } from "../user_profiles/store";
import type { IUserChatFilesPopUp } from "./model";
import UserChatFileList from "./UserChatFileList";

export default function UserChatFilesPopUp(props: IUserChatFilesPopUp) {
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);
    
    const seeUserChat = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(true);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }
    
    return (
        <section className="h-dvh flex md:flex-row flex-col p-2.5 gap-2.5 relative z-10">
            <Navbar isProcessing={props.isProcessing}/>
            <div className="h-full flex flex-col w-full md:w-2/5 border border-gray-400 inset-shadow-sm inset-shadow-gray-400 overflow-y-auto">
                <div className="flex px-2.5 pt-2.5">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                        disabled={props.isProcessing}
                        onClick={seeUserChat}
                        type="button"
                    >
                        <MessageCircle size={22}/>
                    </button>
                </div>
                {props.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : props.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 text-2xl font-medium text-center">{props.error.message}</div>
                    </div>
                ) : (
                    <UserChatFileList files={props.files} isLoading={props.isLoading}/>
                )}
            </div>
        </section>
    );
}
