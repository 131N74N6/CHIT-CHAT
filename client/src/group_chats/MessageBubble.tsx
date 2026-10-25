import { FileIcon } from "lucide-react";
import type { IGroupMessageData } from "./model";
import cn from "../utils/cn";
import { useGroupChatStore } from "./store";
import { useUserChatStore } from "../user_chats/store";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "../group_profiles/store";
import { useUserStore } from "../user_profiles/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MessageBubble(props: IGroupMessageData) {
    const navigate = useNavigate();
    
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);

    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);
    const setChosenMessageIdsFromGroup = useGroupChatStore((state) => state.setChosenMessageIdsFromGroup);

    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    const setGroupMessageId = useGroupChatStore((state) => state.setGroupMessageId);
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);

    const selectMode = useGroupChatStore((state) => state.selectMode);

    const chosenMessageFromGroup = useGroupChatStore((state) => state.chosenMessageFromGroup);
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);

    const setReceiverId = useUserChatStore((state) => state.setReceiverId);
        
    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);

    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    
    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);

    useEffect(() => {
        const canEdit = selectMode && 
        chosenMessageFromGroup && 
        chosenMessageIdsFromGroup.length === 1 &&
        chosenMessageFromGroup.text !== "This message has been deleted";

        if (canEdit) {
            setGroupMessage(props.chat.text);
        } else {
            setGroupMessage("");
        }
    }, [selectMode, chosenMessageIdsFromGroup, chosenMessageFromGroup, setGroupMessage]);

    const isSelected = chosenMessageIdsFromGroup.includes(props.chat._id);

    const closeUserChatPopUp = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    const seeGroupChatFiles = () => {
        setGroupMessageId(props.chat.sender_id);
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(true);
    }

    const seeUserChat = () => {
        navigate("/home");
        setReceiverId(props.chat.sender_id);
        setShowUserMedia(false);
        setShowUserChatPopUp(true);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    const selectMessage = () => {
        if (!selectMode) return;
        setChosenMessageIdsFromGroup(props.chat._id);
        if (props.own) {
            setChosenMessageFromGroup(props.chat);
        } else {
            setChosenMessageFromGroup(null);
        }
    }

    return (
        <div 
            className={cn(
                "flex flex-col gap-1 p-2.5 transition-all duration-200 w-[60%]",
                props.own ? "ml-[40%] bg-blue-700 text-white rounded-t-2xl rounded-bl-2xl" : 
                "mr-[50%] bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl",
                selectMode ? "cursor-pointer hover:opacity-80" : "",
                isSelected ? "border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
            )}
            onClick={selectMessage}
        >
            {props.chat.files_total > 0 ? (
                <div className="cursor-pointer bg-gray-100 p-2 rounded-md">
                    <div 
                        className="items-center gap-2.5 flex" 
                        onClick={seeGroupChatFiles}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                </div>
            ) : null}
            <button 
                className="text-left font-medium text-[0.7rem] cursor-pointer disabled:cursor-not-allowed" 
                disabled={props.isProcessing}
                onClick={() => {
                    if (props.own) {
                        navigate("/profile");
                        closeUserChatPopUp();
                    } else {
                        seeUserChat();
                    }
                }}
                type="button"
            >
                {props.chat.sender_name}
            </button>
            <div className="wrap-break-word font-medium text-base">
                {props.chat.text}
            </div>
            {props.chat.updated_at !== props.chat.created_at ? (
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