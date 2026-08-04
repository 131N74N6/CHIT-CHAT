import type { IChatList } from "../models/chat.model";
import ChatBubble from "./ChatBubble";
import Loading from "./Loading";
import useReverseScroll from "../hooks/useReverseScroll";
import { useRef } from "react";

export default function ChatList(props: IChatList) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const previousScrollHeightlRef = useRef<number>(0);
    const isFetchingRef = useRef<boolean>(false);
    const initialLoadDoneRef = useRef<boolean>(false);

    useReverseScroll({
        data: props.chats,
        fetchNextPage: props.fetchNextPage,
        hasNextPage: props.hasNextPage,
        initialLoadDoneRef: initialLoadDoneRef,
        isFetchingNextPage: props.isFetchingNextPage,
        isFetchingRef: isFetchingRef,
        isProcessing: props.isProcessing,
        previousScrollHeightlRef: previousScrollHeightlRef,
        scrollContainerRef: scrollContainerRef,
        topSentinelRef: topSentinelRef
    });

    if (props.chats.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No chats found...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col py-2.5 overflow-y-auto gap-2" ref={scrollContainerRef}>
            <div ref={topSentinelRef} className="h-1 w-full flex justify-center items-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : !props.hasNextPage ? (
                    <div className="text-center text-[0.8rem] text-gray-950 font-medium">No more older chat to show</div>
                ) : null}
            </div>
            <div className="flex flex-col gap-2">
                {props.chats.map((chat) => {
                    return (
                        <ChatBubble 
                            chat={chat} 
                            key={chat._id}
                            isInRoom={props.isInRoom}
                            isProcessing={props.isProcessing} 
                            isSelectMode={props.isSelectMode}
                            own={props.currentUserId === chat.sender_id}
                            place={props.place}
                            selectedIds={props.selectedIds}
                            setChatId={props.setChatId}
                            toggleSelect={props.toggleSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
}