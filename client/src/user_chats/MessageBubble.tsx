import cn from "../cn";
import { FileIcon } from "lucide-react";
import type { IUserMessageData } from "./model";
import { useUserChatStore } from "./useUserChatStore";
import { useUserStore } from "../user_profiles/useUserStore";

export default function MessageBubble(props: IUserMessageData) {
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);

    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);

    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);
    const setChosenMessageIds = useUserChatStore((state) => state.setChosenMessageIds);

    const selectMode = useUserChatStore((state) => state.selectMode);
    const setChosenMessageId = useUserChatStore((state) => state.setChosenMessageId);

    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);

    const isSelected = chosenMessageIds.includes(props.chat._id);

    const seeUserChatFiles = () => {
        setShowUserMedia(false);
        setChosenMessageId(props.chat._id);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(true);
        setShowUserProfilePopUp(false);
    }

    const selectMessage = () => {
        if (!selectMode) return;
        setChosenMessageIds(props.chat._id);
        if (props.own) {
            setChosenMessage(props.chat);
        } else {
            setChosenMessage(null);
        }
    }

    return (
        <div 
            className={cn(
                "flex flex-col gap-1 p-2.5 transition-all duration-200 w-[60%]",
                props.own ? "ml-[40%] bg-blue-800 text-white rounded-t-2xl rounded-bl-2xl" : 
                "mr-[50%] bg-gray-300 text-gray-900 rounded-t-2xl rounded-br-2xl",
                selectMode ? "cursor-pointer hover:opacity-80" : "",
                isSelected ? "border border-orange-500 bg-orange-50 text-gray-900" : ""
            )}
            onClick={selectMessage}
        >
            {props.chat.files_total > 0 ? (
                <div className={`cursor-pointer ${props.own ? "bg-blue-600" : "bg-gray-200"} p-2 rounded-md`}>
                    <div 
                        className="items-center gap-2.5 flex cursor-pointer" 
                        onClick={seeUserChatFiles}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                </div>
            ) : null}
            <div className="wrap-break-word font-medium text-base">
                {props.chat.text}
            </div>
            {new Date(props.chat.created_at).getSeconds() !== new Date(props.chat.updated_at).getSeconds() ? (
                <div className="flex flex-col gap-1">
                    <div className="wrap-break-word font-medium text-[14px]">
                        Sent: {new Date(props.chat.created_at).toLocaleString()}
                    </div>
                    <div className="wrap-break-word font-medium text-[14px]">
                        Edited: {new Date(props.chat.updated_at).toLocaleString()}
                    </div>
                </div>
            ) : (
                <div className="wrap-break-word font-medium text-[14px]">
                    Sent: {new Date(props.chat.created_at).toLocaleString()}
                </div>
            )}
        </div>
    );
}