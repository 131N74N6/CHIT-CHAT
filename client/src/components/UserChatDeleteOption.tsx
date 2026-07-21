import { BrushCleaning, Check, Eraser, Trash, Trash2, X } from "lucide-react";
import type { IUserChatDeleteOption } from "../models/chat.model";
import cn from "../utils/cn";

export default function UserChatDeleteOption(props: IUserChatDeleteOption) {
    return (
        <>
            {props.marks === 1 ? (
                <div className="fixed inset-0 z-20 flex justify-center items-center h-full bg-[rgba(0,0,0,0.4)]">
                    <div className="bg-white flex flex-col gap-2.5">
                        <button
                            className={cn(
                                "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                                "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                                "flex gap-2 justify-center"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.setShowDeleteOption?.(false)}
                            type="button"
                        >
                            <div>Close</div>
                        </button>
                        <button
                            className={cn(
                                "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                                "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                                "flex gap-2 justify-center"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.clearAllUserChatsForMeMt?.mutate()}
                            type="button"
                        >
                            <Trash size={23}/>
                            <div>Clear All Chats With This Person</div>
                        </button>
                        <button
                            className={cn(
                                "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                                "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                                "flex gap-2 justify-center"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.deleteAllUserChatsMt?.mutate()}
                            type="button"
                        >
                            <BrushCleaning size={23}/>
                            <div>Delete All Chats With This Person</div>
                        </button>
                        <button
                            className={cn(
                                "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                                "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                                "flex gap-2 justify-center"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => {
                                props.setIsSelectMode?.(true);
                                props.setShowDeleteOption?.(false);
                            }}
                            type="button"
                        >
                            <Check size={23}/>
                            <div>Select Chat</div>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-20 flex justify-center items-center h-full bg-[rgba(0,0,0,0.4)]">
                    <div className="bg-white flex flex-col gap-2.5">
                        <button
                            className={cn(
                                "bg-white border border-gray-600 text-gray-600 cursor-pointer disabled:cursor-not-allowed",
                                "hover:bg-gray-600 hover:text-white transition-colors font-medium text-[1rem] p-2 rounded-lg",
                                "flex gap-2 justify-center"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.setIsSelectMode?.(false)}
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
                            onClick={() => props.clearChosenUserChatForMeMt?.mutate()}
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
                            onClick={() => props.deleteChosenUsersChatMt?.mutate()}
                            type="button"
                        >
                            <Eraser size={23}/>
                            <div>Delete Chosen Chats</div>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}