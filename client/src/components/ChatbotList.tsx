import type { IChatbotList } from "../models/chatbot.model";
import ChatbotBubble from "./ChatbotBubble";
import Loading from "./Loading";

export default function ChatbotList(props: IChatbotList) {
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
        <div className="overflow-y-auto flex flex-col gap-2 p-2.5">
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
            {props.results.length <= 14 ? null : (
                <div className="flex justify-center">
                    {props.isFetchingNextPage ? (
                        <Loading/>
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
            )}
        </div>
    );
}