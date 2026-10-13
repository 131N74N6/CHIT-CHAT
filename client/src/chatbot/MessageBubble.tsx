import cn from "../utils/cn";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import type { IEachMessageBot } from "./model";
import { useChatbotStore } from "./store";

export default function MessageBubble(props: IEachMessageBot) {
    const selectMode = useChatbotStore((state) => state.selectMode);

    const selectedChatBotIds = useChatbotStore((state) => state.selectedChatBotIds);
    const setSelectedChatBotIds = useChatbotStore((state) => state.setSelectedChatBotIds);

    const isSelected = selectedChatBotIds.includes(props.results._id);

    const sanitizedAnswer = useMemo(() => {
        if (!props.results.answer) return;
        return DOMPurify.sanitize(props.results.answer, {
            ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sub', 'sup'],
            ALLOWED_ATTR: ['class', 'style']
        });
    }, [props.results.answer, props.results._id]);

    return (
        <div
            className={cn(
                "flex flex-col gap-2 p-2.5 transition-all duration-200",
                props.results.role === "user/human" ? "ml-[40%] bg-blue-700 text-white rounded-t-2xl rounded-bl-2xl w-[60%]" : 
                "bg-gray-200 text-gray-900 rounded-t-2xl rounded-br-2xl w-full",
                selectMode ? "cursor-pointer hover:opacity-80" : "",
                isSelected ? "ring-4 ring-orange-500 border-2 border-orange-600 bg-orange-50 text-gray-900" : ""
            )}
            onClick={() => selectMode && setSelectedChatBotIds(props.results._id)}
        >
            {props.results.role === "user/human" ? (
                <div className="font-medium text-base">{props.results.question}</div>
            ) : (
                <div className="font-medium text-base">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            p: ({ node, ...props }) => <p className="text-gray-900 leading-relaxed" { ...props }></p>,
                            ul: ({ node, ...props }) => <ul className="text-gray-900 list-disc pl-5 my-2 space-y-1" { ...props }></ul>,
                            ol: ({ node, ...props }) => <ol className="text-gray-900 list-decimal pl-5 my-2 space-y-1" { ...props }></ol>,
                            li: ({ node, ...props }) => <li className="text-gray-900" { ...props }></li>,
                            strong: ({ node, ...props }) => <strong className="text-gray-900 font-semibold" { ...props }></strong>,
                            em: ({ node, ...props }) => <em className="text-gray-900 italic" { ...props }></em>,
                            code: ({ node, inline, className, children, ...props }: any) => 
                                inline ? (
                                    <code className="bg-gray-800 text-yellow-300 px-1 py-0.5 rounded text-sm" { ...props }>
                                        {children}
                                    </code>
                                ) : (
                                    <pre className="bg-gray-900 text-violet-500 rounded p-3 overflow-x-auto my-3">
                                        <code className={className} {...props}>{children}</code>
                                    </pre>
                                ),
                            blockquote: ({ node, ...props }) => <blockquote className="bg-gray-400 text-black border-l-4 border-gray-800 italic my-3" { ...props }></blockquote>,
                            h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2" { ...props }></h1>,
                            h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-gray-900 mt-3 mb-2" { ...props }></h2>,
                            h3: ({ node, ...props }) => <h3 className="text-base font-medium text-gray-900 mt-2 mb-1" { ...props }></h3>,

                            hr: ({ node, ...props }) => <hr className="border-gray-400 my-3" { ...props } />,
                            table: ({ node, ...props }) => (
                                <div className="my-3 w-full overflow-x-auto rounded-lg border border-gray-300 shadow-sm relative group">
                                    <table 
                                        className="w-full min-w-100 sm:min-w-125 border-collapse text-xs sm:text-sm" 
                                        {...props}
                                    ></table>
                                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-gray-200/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity sm:hidden"></div>
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-gray-100" { ...props }></thead>,
                            tbody: ({ node, ...props }) => <tbody className="bg-white" { ...props }></tbody>,
                            tr: ({ node, ...props }) => <tr className="hover:bg-gray-50 transition-colors" { ...props }></tr>,
                            th: ({ node, ...props }) => (
                                <th 
                                    className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-2.5 bg-gray-200 text-gray-800 font-semibold whitespace-nowrap text-left" 
                                    { ...props }
                                ></th>
                            ),
                            td: ({ node, ...props }) => (
                                <td 
                                    className="border border-gray-300 px-2 py-2 sm:px-3 sm:py-2 text-gray-700 whitespace-nowrap" 
                                    { ...props }
                                ></td>
                            )
                        }}
                    >
                        {sanitizedAnswer}
                    </ReactMarkdown>
                </div>
            )}
            <div className="flex flex-col gap-2">
                <div className="font-medium text-sm">{new Date(props.results.created_at).toLocaleString()}</div>
            </div>
        </div>
    );
}