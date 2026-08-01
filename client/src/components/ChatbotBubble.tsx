import type { IChatbotBubble } from "../models/chatbot.model";
import cn from "../utils/cn";

export default function ChatbotBubble(props: IChatbotBubble) {
    const isSelected = props.selectedChatBotIds.includes(props.result._id);

    return (
        <div
            className={cn(
                "flex flex-col gap-2 p-2.5 transition-all duration-200 w-[60%]",
                props.result.role === "user/human" ? "ml-[40%] bg-blue-700 text-white rounded-t-2xl rounded-bl-2xl" : 
                "mr-[50%] bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl",
                props.isSelectMode ? "cursor-pointer hover:opacity-80" : "",
                isSelected ? "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
            )}
            onClick={() => props.isSelectMode && props.toggleSelect(props.result._id)}
        >
            {props.result.role === "user/human" ? (
                <div className="wrap-break-word font-medium text-[0.9rem]">{props.result.question}</div>
            ) : (
                <div className="wrap-break-word font-medium text-[0.9rem]">{props.result.answer}</div>
            )}
        </div>
    );
}