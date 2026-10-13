import { BrushCleaning, CheckCircle, Eraser, SendIcon, X } from "lucide-react";
import useChatbotService from "./service";
import Navbar from "../navbar/Navbar";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import Alert from "../alert/Alert";
import MessageList from "./MessageList";
import Loading from "../loading/Loading";
import { useChatbotStore } from "./store";

export default function Chatbot() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const question = useChatbotStore((state) => state.question);
    const setQuestion = useChatbotStore((state) => state.setQuestion);
    
    const selectMode = useChatbotStore((state) => state.selectMode);
    const setSelectMode = useChatbotStore((state) => state.setSelectMode);
    
    const selectedChatBotIds = useChatbotStore((state) => state.selectedChatBotIds);
    const resetSelectedChatBotIds = useChatbotStore((state) => state.resetSelectedChatBotIds);

    const userChatBot = useChatbotService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col h-dvh relative z-10 p-2.5 gap-2.5">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={userChatBot.isProcessing}/>
            <div className="md:w-2/5 w-full flex flex-col h-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {selectMode ? (
                    <div className="bg-gray-200 gap-2 p-2.5 flex items-center">
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={userChatBot.isProcessing}
                            onClick={() => userChatBot.deleteChosenMessagesMt.mutate()}
                            type="button"
                        >
                            <Eraser size={20}/>
                        </button>
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={userChatBot.isProcessing}
                            onClick={() => {
                                setSelectMode(false);
                                if (selectedChatBotIds.length > 0) resetSelectedChatBotIds();
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
                            disabled={userChatBot.isProcessing}
                            onClick={() => userChatBot.deleteAllMessagesMt.mutate()}
                            type="button"
                        >
                            <BrushCleaning size={20}/>
                        </button>
                        <button
                            className="disabled:cursor-not-allowed cursor-pointer text-gray-500 hover:text-gray-700 transition-colors font-medium"
                            disabled={userChatBot.isProcessing}
                            onClick={() => setSelectMode(true)}
                            type="button"
                        >
                            <CheckCircle size={20}/>
                        </button>
                    </div>
                )}
                <main className="flex flex-col gap-2.5 px-2.5 h-[80%]">
                    {userChatBot.showAllBotResults.isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loading/>
                        </div>
                    ) : userChatBot.showAllBotResults.error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-3xl font-medium text-gray-700">{userChatBot.showAllBotResults.error.message}</div>
                        </div>
                    ) : userChatBot.sendQuestionMt.isPending ? (
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
                        <MessageList
                            fetchNextPage={userChatBot.showAllBotResults.fetchNextPage}
                            hasNextPage={userChatBot.showAllBotResults.hasNextPage}
                            isFetchingNextPage={userChatBot.showAllBotResults.isFetchingNextPage}
                            isProcessing={userChatBot.isProcessing}
                            results={userChatBot.showAllBotResults.data ? userChatBot.showAllBotResults.data.pages.flatMap(page => page).reverse() : []}
                        />
                    )}
                </main>
                <form 
                    className="border-t border-gray-400 px-2.5 pt-2.5 pb-1.5 h-[20%] relative flex flex-col gap-1.5"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        userChatBot.sendQuestionMt.mutate();
                    }}
                >
                    <textarea 
                        className="focus:outline-0 outline-0 w-full h-full resize-none pr-12"
                        disabled={userChatBot.isProcessing}
                        id="question"
                        name="question"
                        placeholder="insert question here"
                        onChange={(event) => setQuestion(event.target.value)}
                        value={question} 
                    />
                    {selectMode ? null : (
                        <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed "
                                disabled={userChatBot.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </section>
    );
}