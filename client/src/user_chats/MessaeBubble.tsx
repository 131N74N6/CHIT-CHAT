import { useNavigate } from "react-router-dom";
import cn from "../utils/cn";
import { FileIcon } from "lucide-react";
import type { IUserMessageData } from "./model";
import { useUserChatStore } from "./store";

export default function MessaeBubble(props: IUserMessageData) {
    const navigate = useNavigate();
    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);
    const setChosenMessageIds = useUserChatStore((state) => state.setChosenMessageIds);

    const selectMode = useUserChatStore((state) => state.selectMode);
    const setChosenMessageId = useUserChatStore((state) => state.setChosenMessageId);

    const isSelected = chosenMessageIds.includes(props.chat._id);

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
                        onClick={() => setChosenMessageId(props.chat._id)}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                    <div 
                        className="items-center gap-2.5 cursor-pointer md:hidden flex" 
                        onClick={() => {
                            setChosenMessageId(props.chat._id);
                            navigate(`/user/media/detail/${props.chat._id}`);
                            // props.setChatId(props.chat._id);
                            // navigate(`/room/media/detail/${props.chat._id}`);
                        }}
                    >
                        <FileIcon size={16}/>
                        <div>{props.chat.files_total} files</div>
                    </div>
                </div>
            ) : null}
            {/* {props.place.name === "room-chat" ? 
                props.own ? (
                    <div className="text-left font-medium text-[0.7rem]">{props.chat.sender_name}</div>
                ) : (
                    <button 
                        className="text-left font-medium text-[0.7rem] cursor-pointer disabled:cursor-not-allowed" 
                        disabled={props.isProcessing}
                        onClick={() => {
                            if (props.place.setReceiverId) props.place.setReceiverId(props.chat.sender_id);
                            navigate(`/user/chat/${props.chat.sender_id}`);
                        }}
                        type="button"
                    >
                        {props.chat.sender_name}
                    </button>
                ) : (
                    null
                )} */}
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