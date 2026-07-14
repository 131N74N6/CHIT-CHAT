import type { ChatListIntrf } from "../models/chat.model";
import cn from "../utils/cn";
import ChatBubble from "./ChatBubble";
import Loading from "./Loading";

export default function ChatList(props: ChatListIntrf) {
    return (
        <div className="flex flex-col gap-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2">
                {props.chats.map((chat) => {
                    return (
                        <ChatBubble 
                            chat={chat} 
                            key={chat._id}
                            isProcessing={props.isProcessing} 
                            onClearOne={props.onClearOne} 
                            onDeleteOne={props.onDeleteOne}
                            onDeleteOnePermanent={props.onDeleteOnePermanent}
                            own={props.currentUserId === chat.sender_id}
                        />
                    );
                })}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : props.chats.length <= 14 ? (
                    <></>
                ) : props.hasNextPage ? (
                    <button
                        disabled={props.isProcessing}
                        className={cn(
                            "cursor-pointer disabled:cursor-not-allowed bg-gray-400 text-gray-950", 
                            "font-medium p-1.5 text-[0.8rem] hover:bg-gray-300 transition-colors"
                        )}
                        onClick={() => props.fetchNextPage()}
                        type="button"
                    >
                        Load more
                    </button>
                ) : (
                    <div className="text-center text-[0.8rem] text-gray-950 font-medium">No chat to show</div>
                )}
            </div>
        </div>
    );
}