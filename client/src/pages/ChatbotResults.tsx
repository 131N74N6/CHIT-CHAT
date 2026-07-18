import { useNavigate } from "react-router-dom";
import ChatbotList from "../components/ChatbotList";
import useChatbotResultService from "../services/useChatbotResultService";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";

export default function ChatbotResults() {
    const navigate =  useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { allResults, deleteAllResultsMt, deleteResultMt } = useChatbotResultService({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col relative h-screen z-10">
            <Navbar isProcessing={allResults.isResultsLoading || deleteAllResultsMt.isPending || deleteResultMt.isPending}/>
            {message ? <Alert message={message}/> : null}
            <div className="flex flex-col px-2.5 pt-2.5 h-full">
                <div className="flex gap-1.5">
                    <button
                        className={cn(
                            "font-medium text-gray-600 text-[0.95rem] cursor-pointer", 
                            "disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                        )}
                        disabled={
                            allResults.isResultsLoading || 
                            deleteResultMt.isPending || 
                            deleteAllResultsMt.isPending
                        }
                        onClick={() => deleteAllResultsMt.mutate()}
                        type="button"
                    >
                        <Trash2 size={23}/>
                    </button>
                </div>
                <ChatbotList
                    fetchNextPage={allResults.fetchNextResults}
                    hasNextPage={allResults.resultsHaveNext}
                    isFetchingNextPage={allResults.resultsFetchNextPage}
                    isProcessing={
                        allResults.isResultsLoading || 
                        deleteResultMt.isPending || 
                        deleteAllResultsMt.isPending
                    }
                    navigate={navigate}
                    results={allResults.paginatedResults}
                    onDelete={deleteResultMt}
                />
            </div>
        </section>
    );
}