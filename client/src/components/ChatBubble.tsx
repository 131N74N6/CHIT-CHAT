import { useNavigate } from "react-router-dom";
import type { IChatBubble } from "../models/chat.model";
import cn from "../utils/cn";

export default function ChatBubble(props: IChatBubble) {
    const navigate = useNavigate();
    const isSelected = props.selectedIds.includes(props.chat._id);

    return (
        <div 
            onClick={() => props.isSelectMode && props.toggleSelect(props.chat._id)}
            className={cn(
                "flex flex-col gap-2 p-2.5 transition-all duration-200 w-[60%]",
                props.own ? "ml-[40%] bg-blue-700 text-white rounded-t-2xl rounded-bl-2xl" : 
                "mr-[50%] bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl",
                props.isSelectMode && "cursor-pointer hover:opacity-80",
                isSelected && "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900"
            )}
        >
            {props.chat.media.length > 0 ? (
                <div className="w-full h-auto min-h-12.5 bg-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                    [Media: {props.chat.media[0].url}]
                </div>
            ) : null}
            {props.place.name === "room-chat" ? 
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
                )}
            <div className="wrap-break-word font-medium text-[0.9rem]">{props.chat.messages}</div>
        </div>
    );
}