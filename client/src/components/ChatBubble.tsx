import type { ChatBubbleIntrf } from "../models/chat.model";

export default function ChatBubble(props: ChatBubbleIntrf) {
    return (
        <div className={`
            ${props.own ? 'ml-[50%] bg-blue-700 text-white' : 'mr-[50%] bg-gray-400 text-gray-900 w-[60%]'} 
            font-300 flex flex-col gap-1 p-1
        `}>
            {props.chat.media.length > 0 ? <div>{props.chat.media[0].url}</div> : null}
            <div>{props.chat.messages}</div>
            <div>
                <button></button>
            </div>
        </div>
    );
}