import type { ChatBubbleIntrf } from "../models/chat.model";

export default function ChatBubble(props: ChatBubbleIntrf) {
    return (
        <div className={`
            ${props.own ? 'ml-[100%] bg-blue-700 text-white' : 'mr-[100%] bg-gray-400 text-gray-900 w-[60%]'} 
            font-300 flex flex-col gap-1 p-1
        `}>
            <div>{props.chat.media[0].url}</div>
            <div>{props.chat.messages}</div>
            <div>
                <button></button>
            </div>
        </div>
    );
}