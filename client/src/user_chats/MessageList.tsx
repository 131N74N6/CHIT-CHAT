import ChatBubble from "./MessaeBubble";
import { useCallback, useEffect, useRef } from "react";
import type { IUserMessageList } from "./model";
import { useUserStore } from "../user_profiles/store";

export default function MessageList(props: IUserMessageList) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // Ref untuk menyimpan state scroll sebelum memuat pesan lama
    const previousScrollHeightRef = useRef<number>(0);
    const previousScrollTopRef = useRef<number>(0);
    
    // Ref untuk melacak panjang pesan sebelumnya
    const prevMessagesLengthRef = useRef<number>(0);
    
    const currentUserId = useUserStore((state) => state.currentUserId);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container || props.chats.length === 0) return;

        const initialLoad = prevMessagesLengthRef.current === 0 && props.chats.length > 0;
        const newMessageExist = props.chats.length > prevMessagesLengthRef.current && !props.isFetchingNextPage;

        if (initialLoad || newMessageExist) {
            requestAnimationFrame(() => {
                if (container) container.scrollTop = container.scrollHeight;
            });
        }

        prevMessagesLengthRef.current = props.chats.length;
    }, [props.chats, props.isFetchingNextPage]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (props.isFetchingNextPage) {
            previousScrollHeightRef.current = container.scrollHeight;
            previousScrollTopRef.current = container.scrollTop;
        } else if (previousScrollHeightRef.current > 0) {
            const newScrollHeight = container.scrollHeight;
            const heightDifference = newScrollHeight - previousScrollHeightRef.current;

            container.scrollTop = previousScrollTopRef.current + heightDifference;
            previousScrollHeightRef.current = 0;
        }
    }, [props.isFetchingNextPage, props.chats]);

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const currentScrollContainer = scrollContainerRef.current;

        if (currentScrollContainer.scrollTop < 52 && props.hasNextPage && !props.isFetchingNextPage ) {
            props.fetchNextPage();
        }
    }, [props.hasNextPage, props.isFetchingNextPage, props.hasNextPage]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

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
            {props.hasNextPage ? (
                <section className="flex justify-center">
                    <button
                        className="cursor-pointer disabled:cursor-not-allowed bg-olive-800 text-white font-medium text-sm p-2 w-40 rounded-md hover:bg-olive-600 transition-colors"
                        disabled={props.isProcessing}
                        onClick={() => props.fetchNextPage()}
                        type="button"
                    >
                        Show more
                    </button>
                </section>
            ) : props.isFetchingNextPage ? (
                <section className="flex justify-center">
                    <div className="animate-spin border-t-2 border-b-2 rounded-full w-9 h-9 border-blue-900"></div>
                </section>
            ) : props.chats.length > 0 ? (
                <section className="flex justify-center">
                    <div className="text-base text-gray-800 font-medium">You've reached the end</div>
                </section>
            ) : null}
            <div className="flex flex-col gap-2">
                {props.chats.map((chat) => {
                    return (
                        <ChatBubble 
                            chat={chat} 
                            key={chat._id}
                            isProcessing={props.isProcessing} 
                            own={currentUserId === chat.sender_id}
                        />
                    );
                })}
            </div>
        </div>
    );
}