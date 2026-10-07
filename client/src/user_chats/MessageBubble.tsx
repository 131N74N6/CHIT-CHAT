import { useNavigate } from "react-router-dom";
import cn from "../utils/cn";
import { FileIcon } from "lucide-react";
import type { IUserMessageData } from "./model";
import { useUserChatStore } from "./store";
import { useUserStore } from "../user_profiles/store";

export default function MessageBubble(props: IUserMessageData) {
    const navigate = useNavigate();
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);

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

    const seeUserChatFilesPage = () => {
        setChosenMessageId(props.chat._id);
        navigate(`/user/media/detail/${props.chat._id}`);
    }

    return (
        <div 
            className={cn(
                "flex flex-col gap-1 p-2.5 transition-all duration-200 w-[60%]",
                props.own ? "ml-[40%] bg-blue-700 text-white rounded-t-2xl rounded-bl-2xl" : 
                "mr-[50%] bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl",
                selectMode ? "cursor-pointer hover:opacity-80" : "",
                isSelected ? "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
            )}
            onClick={() => selectMode && setChosenMessageIds(props.chat._id)}
        >
            {props.chat.files_total > 0 ? (
                <div className="cursor-pointer bg-gray-100 p-2 rounded-md">
                    <div 
                        className="items-center gap-2.5 md:flex hidden" 
                        onClick={seeUserChatFiles}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                    <div 
                        className="items-center gap-2.5 cursor-pointer md:hidden flex" 
                        onClick={seeUserChatFilesPage}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                </div>
            ) : null}
            <div className="wrap-break-word font-medium text-base">
                {props.chat.text}
            </div>
            <div className="wrap-break-word font-medium text-[14px]">
                Sent: {new Date(props.chat.created_at).toLocaleString()}
            </div>
            {props.chat.updated_at !== props.chat.created_at ? (
                <div className="wrap-break-word font-medium text-[14px]">
                    Edited: {new Date(props.chat.updated_at).toLocaleString()}
                </div>
            ) : null}
        </div>
    );
}