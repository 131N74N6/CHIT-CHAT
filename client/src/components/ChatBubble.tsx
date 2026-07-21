import type { IChatBubble } from "../models/chat.model";
import cn from "../utils/cn";

export default function ChatBubble(props: IChatBubble) {
    return (
        <>
            {props.isSelectMode ? (
                <div className="flex items-center gap-2.5">
                    <input 
                        checked={props.selectedIds.includes(props.chat._id)}
                        onChange={() => props.toggleSelect(props.chat._id)}
                        type="checkbox"
                    />
                    <div 
                        className={cn(
                            `${props.own ? "ml-[50%] bg-blue-700 text-white" : "mr-[50%] bg-gray-400 text-gray-900 w-[60%]"}`, 
                            "font-300 flex flex-col gap-1 p-1"
                        )}
                    >
                        {props.chat.media.length > 0 ? <div>{props.chat.media[0].url}</div> : null}
                        <div>{props.chat.messages}</div>
                        <div>
                            <button></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className={cn(
                        `${props.own ? "ml-[50%] bg-blue-700 text-white" : "mr-[50%] bg-gray-400 text-gray-900 w-[60%]"}`, 
                        "font-300 flex flex-col gap-1 p-1"
                    )}
                >
                    {props.chat.media.length > 0 ? <div>{props.chat.media[0].url}</div> : null}
                    <div>{props.chat.messages}</div>
                    <div>
                        <button></button>
                    </div>
                </div>
            )}
        </>
    );
}