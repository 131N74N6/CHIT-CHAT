import chatbotQuestionService from "../services/chatbot_question.service";

export default function Chatbot() {
    const { answer, askAiMt, setQuestion, question } = chatbotQuestionService();

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