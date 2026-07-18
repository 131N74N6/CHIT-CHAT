import { Send } from "lucide-react";
import FileViewer from "../components/FileViewer";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import useUserChatService from "../services/useUserChatService";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";

export default function UserMediaPreview() {
    const { receiver_id } = useParams();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        handleImagePreview, 
        inputMediaRef, 
        isUserChatProcessing,
        media,
        sendChatToUserMt,
        setText,
        text 
    } = useUserChatService({ receiverId: receiver_id, setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex flex-col relative z-10">
            <Navbar isProcessing={isUserChatProcessing}/>
            <form 
                className="flex flex-col h-full px-2.5 pt-2.5"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    sendChatToUserMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    id="room-file"
                    name="room-file"
                    onChange={handleImagePreview}
                    ref={inputMediaRef}
                    type="file"
                />
                <div 
                    className={cn(
                        "border-gray-600 border-dashed rounded p-2 grid gap-2", 
                        "md:grid-cols-3 sm:grid-cols-2 grid-cols-1 overflow-y-auto"
                    )}
                    onClick={() => inputMediaRef.current?.click()}
                >
                    {media.length > 0 ? (
                        media.map((media, index) => {
                            return (
                                <FileViewer
                                    file={media.file}
                                    fileName={media.fileName}
                                    fileType={media.fileType}
                                    key={`file-in-room-${index}`}
                                    previewUrl={media.previewUrl}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}
                </div>
                <div className="max-h-[30%] p-2 border border-gray-500 rounded flex flex-col gap-2">
                    <input
                        className="focus:outline-0 text-gray-600 font-medium text-[0.9rem]"
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                        type="text"
                    />
                    <button
                        className={cn(
                            "text-gray-600 font-medium cursor-pointer transition-colors ", 
                            "hover:text-gray-400 disabled:cursor-not-allowed"
                        )}
                        disabled={isUserChatProcessing}
                    >
                        <Send size={23}/>
                    </button>
                </div>
            </form>
        </section>
    );
}