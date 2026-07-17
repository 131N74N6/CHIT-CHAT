import type { IChatbotList } from "../models/chatbot.model";
import cn from "../utils/cn";
import ChatbotCard from "./ChatbotCard";
import Loading from "./Loading";

export default function ChatbotList(props: IChatbotList) {
    if (props.results.length === 0) {
        return (
            <section className="flex justify-center items-center fixed inset-0 z-20 border bg-[rgba(0,0,0,0.66)] p-3">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No results found...</span>
                </div>
            </section>
        );
    }

    return (
        <div className="overflow-y-auto flex flex-col p-y-2.5">
            <div className={cn(
                "xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid gap-2.5"
            )}>
                {props.results.map(result => {
                    return (
                        <ChatbotCard
                            isProcessing={props.isProcessing}
                            key={result._id}
                            navigate={props.navigate}
                            onDelete={props.onDelete}
                            result={result}
                        />
                    );
                })}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : props.results.length <= 14 ? (
                    <></>
                ) : props.hasNextPage ? (
                    <button
                        disabled={props.isProcessing}
                        className={`
                            cursor-pointer disabled:cursor-not-allowed bg-gray-400 
                            text-gray-950 font-medium p-1.5 text-[0.8rem] hover:bg-gray-300 transition-colors
                        `}
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