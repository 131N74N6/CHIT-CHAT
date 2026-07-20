import { MessageCircle } from "lucide-react";
import useChatbotService from "../services/useChatbotService";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";

export default function Chatbot() {
    const { answer, askAiMt, setQuestion, question } = useChatbotService();

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10 p-2.5 gap-2.5">
            <Navbar isProcessing={askAiMt.isPending}/>
            <form 
                className="flex flex-col w-full md:w-2/5 inset-shadow-sm inset-shadow-gray-400 h-full p-1.5 gap-1.5 border border-gray-400" 
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    askAiMt.mutate();
                }}
            >
                <div>{answer}</div>
                <input 
                    id="question"
                    name="question"
                    placeholder="insert question here"
                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setQuestion(event.target.value)}
                    type="text" 
                    value={question} 
                />
            </form>
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