import type { IChatbotBubble } from "../models/chatbot.model";
import cn from "../utils/cn";

export default function ChatbotCard(props: IChatbotBubble) {
    const isSelected = props.selectedChatBotIds.includes(props.result._id);

    return (
        <div className="flex flex-col gap-2.5 rounded-sm transition-all duration-200">
            {props.result.role === "user/human" ? (
                <div 
                    className={cn(
                        "w-[60%] ml-[50%] bg-blue-700 text-white",
                        props.isSelectMode ? "cursor-pointer hover:opacity-80" : "",
                        isSelected ? "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
                    )}
                    onClick={() => props.isSelectMode && props.toggleSelect(props.result._id)}
                >         
                    <div className="wrap-break-word font-medium text-[0.9rem]">{props.result.question}</div>
                </div>
            ) : (
                <div 
                    className={cn(
                        "w-[60%] mr-[50%] bg-gray-200 text-gray-900",
                        props.isSelectMode ? "cursor-pointer hover:opacity-80" : "",
                        isSelected ? "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
                    )}
                    onClick={() => props.isSelectMode && props.result.question_id && props.toggleSelect(props.result.question_id)}
                >         
                    <div className="wrap-break-word font-medium text-[0.9rem]">{props.result.answer}</div>
                </div>
            )}
        </div>
    );
}