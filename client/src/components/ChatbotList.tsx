import type { IChatbotList } from "../models/chatbot.model";
import ChatbotBubble from "./ChatbotBubble";
import Loading from "./Loading";
import useReverseScroll from "../hooks/useReverseScroll";
import { useRef } from "react";

export default function ChatbotList(props: IChatbotList) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const topSentinelRef = useRef<HTMLDivElement>(null);
    const previousScrollHeightlRef = useRef<number>(0);
    const isFetchingRef = useRef<boolean>(false);
    const initialLoadDoneRef = useRef<boolean>(false);

    useReverseScroll({
        data: props.results,
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

    if (props.results.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No results found...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto flex flex-col gap-2 py-2.5">
            {props.isFetchingNextPage ? (
                <div ref={topSentinelRef} className="h-1 w-full flex justify-center items-center">
                    <Loading/>
                </div>
            ) : !props.isFetchingNextPage && !props.hasNextPage && props.results.length <= 14 ? null : (
                <div className="flex justify-center">
                    <div className="text-center text-[0.8rem] text-gray-950 font-medium">No more older chat to show</div>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {props.results.map(result => {
                    return (
                        <ChatbotBubble 
                            isProcessing={props.isProcessing}
                            isSelectMode={props.isSelectMode}
                            key={result._id} 
                            result={result}
                            selectedChatBotIds={props.selectedChatBotIds}
                            toggleSelect={props.toggleSelect}
                        />
                    );
                })}
            </div>
        </div>
    );
}