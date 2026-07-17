import cn from "../utils/cn";
import ChatList from "./ChatList";
import Loading from "./Loading";
import { File, SendIcon } from "lucide-react";
import type { IRoomChatWindow } from "../models/room.model";

export default function RoomChatWindow(props: IRoomChatWindow) {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="bg-gray-500 flex gap-1.5 p-2 cursor-pointer" onClick={props.seeProfile}>
                <div className="w-20 h-20 rounded-full">
                    {props.roomProfile.profile_picture && props.roomProfile.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img
                                className="w-full h-full object-cover"
                                alt={props.roomProfile.profile_picture.public_id}
                                src={props.roomProfile.profile_picture.url}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full h-full rounded-full flex items-center", 
                            "justify-center bg-blue-600 text-white font-extralight"
                        )}>
                            {props.roomProfile.name[0]}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2.5 p-1">
                {props.isRoomChatLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : props.roomChatError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.roomChatError.message}
                        </div>
                    </div>
                ) : (
                    <ChatList
                        chats={props.roomChats}
                        currentUserId={props.currentUserId}
                        fetchNextPage={props.fetchNextRoomChat}
                        hasNextPage={props.hasNextRoomChat}
                        isFetchingNextPage={props.isFetchingNextRoomChat}
                        isProcessing={props.isProcessing}
                        onClearOne={props.onClearOne}
                        onDeleteOne={props.onDeleteOne}
                        onDeleteOnePermanent={props.onDeleteOne}
                    />
                )}
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 max-h-[30%] overflow-y-auto"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        props.sendChatToRoom.mutate();
                    }}
                >
                    <div className="flex justify-end">
                        <input
                            className="inline-0 text-gray-900 font-light w-[90%]"
                            id="message"
                            name="message"
                            type="text"
                        />
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed", 
                                "text-white rounded-full flex justify-center items-center p-1.5",
                                "bg-blue-600 w-[10%] h-[10%] transition-colors hover:bg-blue-500" 
                            )}
                            disabled={props.isProcessing}
                            type="submit"
                        >
                            <SendIcon size={22}/>
                        </button>
                    </div>
                    <div>
                        <button 
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed", 
                                "border border-gray-500 bg-white text-gray-500 w-[20%] p-1.5"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.navigate(`/media/preview`)}
                            type="button"
                        >
                            <File size={22}/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}