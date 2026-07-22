import { BrushCleaning, Check, Trash } from "lucide-react";
import cn from "../utils/cn";
import type { IRoomChatDeleteOption1 } from "../models/room.model";

export default function RoomChatDeleteOption1(props: IRoomChatDeleteOption1) {
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
                    onClick={() => props.setShowDeleteOption1(false)}
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
                    onClick={() => props.clearAllRoomChatsForMeMt.mutate()}
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
                    onClick={() => props.deleteAllChatsInRoomMt.mutate()}
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
                        props.setIsSelectMode(true);
                        props.setShowDeleteOption1(false);
                    }}
                    type="button"
                >
                    <Check size={23}/>
                    <div>Start Select Chat</div>
                </button>
            </div>
        </div>
    )
}