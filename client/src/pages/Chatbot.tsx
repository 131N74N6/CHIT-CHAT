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
        showAllBotResults, 
        askAiMt, 
        clearSelectedResults,
        deleteAllResultsMt, 
        deleteChosenResultsMt,
        isChatbotProcessing, 
        isSelectMode,
        question,
        selectedChatBotIds,
        setIsSelectMode,
        setQuestion, 
        toggleSelect
    } = useChatbotService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-dvh relative z-10 p-2.5 gap-2.5">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={askAiMt.isPending}/>
            <div className="md:w-2/5 w-full flex flex-col h-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
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
                            onClick={() => {
                                setIsSelectMode(false);
                                if (selectedChatBotIds.length > 0) clearSelectedResults();
                            }}
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
                <div className="flex flex-col gap-2.5 px-2.5 h-[80%]">
                    {showAllBotResults.isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading/>
                        </div>
                    ) : showAllBotResults.error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-3xl font-medium text-gray-700">{showAllBotResults.error.message}</div>
                        </div>
                    ) : askAiMt.isPending ? (
                        <div className="flex flex-col gap-2">
                            <div className="w-[60%] ml-[40%] bg-blue-700 text-white rounded-sm p-2.5">
                                <div className="wrap-break-word font-medium text-[0.9rem]">
                                    {question}
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 text-gray-900 rounded-sm justify-center p-2.5 flex items-center gap-2">
                                <Loading/>
                                <div className="font-medium text-[0.9rem] text-gray-700">
                                    AI is thinking...
                                </div>
                            </div>
                        </div>
                    ) : (
                        <ChatbotList
                            fetchNextPage={showAllBotResults.fetchNextPage}
                            hasNextPage={showAllBotResults.hasNextPage}
                            isFetchingNextPage={showAllBotResults.isFetchingNextPage}
                            isProcessing={isChatbotProcessing}
                            isSelectMode={isSelectMode}
                            results={showAllBotResults.data ? showAllBotResults.data.pages.flatMap(page => page).reverse() : []}
                            selectedChatBotIds={selectedChatBotIds}
                            toggleSelect={toggleSelect}
                        />
                    )}
                </div>
                <form 
                    className="border-t border-gray-400 px-2.5 pt-2.5 pb-1.5 h-[20%] relative flex flex-col gap-1.5"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        askAiMt.mutate();
                    }}
                >
                    <textarea 
                        className="focus:outline-0 outline-0 w-full h-full resize-none pr-12"
                        disabled={isSelectMode || isChatbotProcessing}
                        id="question"
                        name="question"
                        placeholder="insert question here"
                        onChange={(event) => setQuestion(event.target.value)}
                        value={question} 
                    />
                    {isSelectMode ? null : (
                        <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed "
                                disabled={askAiMt.isPending}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                        </div>
                    )}
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