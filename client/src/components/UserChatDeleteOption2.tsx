import cn from "../utils/cn";
import { Eraser, Trash2, X } from "lucide-react";
import type { IUserChatDeleteOption2 } from "../models/chat.model";

export default function UserChatDeleteOption2(props: IUserChatDeleteOption2) {
    return (
        <div className="fixed inset-0 z-20 flex justify-center items-center h-full bg-[rgba(0,0,0,0.4)]">
            <div className="bg-white flex flex-col gap-2.5 p-2.5 rounded-[10px]">
                <button
                    className={cn(
                        "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                        "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                        "flex gap-2 justify-center"
                    )}
                    disabled={props.isProcessing}
                    onClick={() => {
                        props.clearSelection();
                        props.setIsSelectMode(false);
                        props.setShowDeleteOption2(false);
                    }}
                    type="button"
                >
                    <X size={23}/>
                    <div>Close</div>
                </button>
                <button
                    className={cn(
                        "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                        "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                        "flex gap-2 justify-center"
                    )}
                    disabled={props.isProcessing}
                    onClick={() => props.clearChosenUserChatForMeMt.mutate()}
                    type="button"
                >
                    <Trash2 size={23}/>
                    <div>Clear Chosen Chats</div>
                </button>
                <button
                    className={cn(
                        "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                        "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                        "flex gap-2 justify-center"
                    )}
                    disabled={props.isProcessing}
                    onClick={() => props.deleteChosenUsersChatMt.mutate()}
                    type="button"
                >
                    <Eraser size={23}/>
                    <div>Delete Chosen Chats</div>
                </button>
            </div>
        </div>
    );
}