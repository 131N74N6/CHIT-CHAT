import { BrushCleaning, CheckCircle, Eraser, MessageCircle, SendIcon, X } from "lucide-react";
import useChatbotService from "../services/useChatbotService";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";
import ChatbotList from "../components/ChatbotList";
import Loading from "../components/Loading";

export default function Chatbot() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        allResults, 
        answer, 
        askAiMt, 
        deleteAllResultsMt, 
        deleteChosenResultsMt,
        isChatbotProcessing, 
        isSelectMode,
        question,
        selectedChatBotIds,
        setIsSelectMode,
        setQuestion, 
        toggleSelect
    } = useChatbotService({ setMessage: setMessage });

    console.log(answer);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 p-2.5 gap-2.5">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={askAiMt.isPending}/>
            <div className="md:w-2/5 w-full flex flex-col gap-2.5 h-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400">
                {isSelectMode ? (
                    <div className="bg-gray-200 gap-2 p-2.5 flex items-center">
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={isChatbotProcessing}
                            onClick={() => deleteChosenResultsMt.mutate()}
                            type="button"
                        >
                            <Eraser size={20}/>
                        </button>
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={isChatbotProcessing}
                            onClick={() => setIsSelectMode(false)}
                            type="button"
                        >
                            <X size={20}/>
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-200 gap-2 p-2.5 flex items-center">
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={isChatbotProcessing}
                            onClick={() => deleteAllResultsMt.mutate()}
                            type="button"
                        >
                            <BrushCleaning size={20}/>
                        </button>
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={isChatbotProcessing}
                            onClick={() => setIsSelectMode(true)}
                            type="button"
                        >
                            <CheckCircle size={20}/>
                        </button>
                    </div>
                )}
                {allResults.isResultsLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : allResults.resultsError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-3xl font-medium text-gray-700">{allResults.resultsError.message}</div>
                    </div>
                ) : (
                    <ChatbotList
                        fetchNextPage={allResults.fetchNextResults}
                        hasNextPage={allResults.resultsHaveNext}
                        isFetchingNextPage={allResults.resultsFetchNextPage}
                        isProcessing={isChatbotProcessing}
                        isSelectMode={isSelectMode}
                        results={allResults.paginatedResults}
                        selectedChatBotIds={selectedChatBotIds}
                        toggleSelect={toggleSelect}
                    />
                )}
                <form 
                    className="border-t border-gray-400 px-2.5 pt-2.5 pb-1.5 h-[15%]"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        askAiMt.mutate();
                    }}
                >
                    <textarea 
                        className="focus:outline-0 outline-0 font-medium text-gray-700 text-[1rem] w-[95%] resize-none"
                        id="question"
                        name="question"
                        placeholder="insert question here"
                        onChange={(event) => setQuestion(event.target.value)}
                        value={question} 
                    />
                    <button
                        className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed w-[5%]"
                        disabled={askAiMt.isPending}
                        type="submit"
                    >
                        <SendIcon size={22}/>
                    </button>
                </form>
            </div>
            <div 
                className={cn(
                    "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                    "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                    "border border-gray-400"
                )}
            >
                <div className="flex flex-col gap-2">
                    <div className="text-gray-500 font-medium flex justify-center">
                        <MessageCircle size={34}/>
                    </div>
                    <div className="text-gray-700 font-medium text-center">
                        Welcome to Chit Chat
                    </div>
                </div>
            </div>
        </section>
    );
}