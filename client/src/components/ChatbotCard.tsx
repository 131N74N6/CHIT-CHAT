import { AlertCircle, Trash } from "lucide-react";
import type { IChatbotCard } from "../models/chatbot.model";
import cn from "../utils/cn";

export default function ChatbotCard(props: IChatbotCard) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1.5">
                <div className="text-[0.9rem] text-gray-500 font-light">
                    {new Date(props.result.created_at).toLocaleString()}
                </div>
                <div className="text-[1.2rem] text-gray-500 font-bold">
                    {props.result.question}
                </div>
                <div className="text-[1rem] text-gray-500 font-medium">
                    {props.result.response}
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    className={cn(
                        "font-medium text-gray-600 text-[0.95rem] cursor-pointer", 
                        "disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    )}
                    disabled={props.isProcessing}
                    onClick={() => props.onDelete.mutate(props.result._id)}
                    type="button"
                >
                    <Trash size={23}/>
                </button>
                <button
                    className={cn(
                        "font-medium text-gray-600 text-[0.95rem] cursor-pointer", 
                        "disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    )}
                    disabled={props.isProcessing}
                    onClick={() => props.navigate(`chatbot/detail/${props.result._id}`)}
                    type="button"
                >
                    <AlertCircle size={23}/>
                </button>
            </div>
        </div>
    );
}