import useChatbotQuestionService from "../services/useChatbotQuestionService";

export default function Chatbot() {
    const { answer, askAiMt, setQuestion, question } = useChatbotQuestionService();

    return (
        <section className="flex md:flex-row flex-col h-screen relative z-10">
            <form 
                className="flex flex-col" 
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
        </section>
    );
}