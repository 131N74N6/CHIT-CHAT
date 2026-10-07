import { MessageCircle } from "lucide-react";
import UserChatFileList from "../user_chats/UserChatFileList";
import { useGroupChatStore } from "./store";
import Loading from "../components/Loading";
import { useGroupProfileStore } from "../group_profiles/store";
import { useGroupMemberStore } from "../group_member/store";
import type { IGroupChatFilesPopUp } from "./model";

export default function GroupChatFilesPopUp(props: IGroupChatFilesPopUp) {
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);

    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);
    
    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const seeGroupChat = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
            <div className="border-gray-400 inset-shadow-sm inset-shadow-gray-400">
                <div className="flex px-2.5 pt-2.5">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed font-medium text-gray-700 hover:text-gray-500 transition-colors"
                        disabled={props.isProcessing}
                        onClick={seeGroupChat}
                        type="button"
                    >
                        <MessageCircle size={22}/>
                    </button>
                </div>
                {props.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.error.message}
                        </div>
                    </div>
                ) : props.isLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : (
                    <UserChatFileList files={props.files} isLoading={props.isLoading}/>
                )}
            </div>
        </section>
    );
}