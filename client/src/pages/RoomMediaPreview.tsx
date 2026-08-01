import Navbar from "../components/Navbar";
import useRoomChatService from "../services/useRoomChatService";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { FilesIcon, MessageCircle, SendIcon, X } from "lucide-react";
import cn from "../utils/cn";
import FileViewer from "../components/FileViewer";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { useRoomStore } from "../stores/room.store";

export default function RoomMediaPreview() {
    const navigate = useNavigate();
    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        handleMediaPreview, 
        inputMediaRef, 
        isRoomChatProcessing,
        media,
        removeOnePreviewFile,
        sendChatToRoomMt,
        setText,
        text 
    } = useRoomChatService();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        const savedRoomId = localStorage.getItem("room_id");
        if (savedRoomId && !roomId) setRoomId(savedRoomId);
    }, []);

    useEffect(() => {
        if (roomId) {
            localStorage.setItem("room_id", roomId);
        } else {
            localStorage.removeItem("room_id");
        }
    }, [roomId]);

    return (
        <section className="flex md:flex-row flex-col h-dvh gap-2.5 p-2.5 relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isRoomChatProcessing}/>
            <form 
                className="flex flex-col h-full gap-2.5 p-2.5 md:w-2/5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    sendChatToRoomMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    id="room-file"
                    multiple
                    name="room-file"
                    onChange={handleMediaPreview}
                    ref={inputMediaRef}
                    type="file"
                />
                <div 
                    className="border border-dashed cursor-pointer border-gray-600 h-[80%] overflow-y-auto" 
                    onClick={() => inputMediaRef.current?.click()}
                >
                    {media.length > 0 ? (
                        <div className="rounded p-2 grid gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                            {media.map((media, index) => {
                                return (
                                    <div className=" relative group">
                                        <FileViewer
                                            file={media.file}
                                            fileName={media.fileName}
                                            fileType={media.fileType}
                                            key={`file-in-room-${index}`}
                                            previewUrl={media.previewUrl}
                                        />
                                        <button
                                            className={cn(
                                                "transition-opacity duration-300 ease-in-out cursor-pointer absolute top-1 right-1", 
                                                "text-white font-medium bg-red-600 w-6 h-6 rounded-full flex justify-center items-center"
                                            )}
                                            disabled={isRoomChatProcessing}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeOnePreviewFile(media.fileName)
                                            }}
                                            type="button"
                                        >
                                            <X size={14}/>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex h-full justify-center items-center">
                            <div className="flex flex-col gap-2.5">
                                <div className="text-xl text-gray-500 font-medium text-center">Click here to select files</div>
                                <div className="text-gray-500 font-medium flex justify-center"><FilesIcon size={32}/></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex relative flex-col gap-2 p-2 border border-dashed border-gray-400 h-[20%] rounded">
                    <textarea
                        className="focus:outline-0 outline-0 w-full h-full resize-none pr-12"
                        id="message"
                        name="message"
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                    />
                    <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                        <div className="flex flex-col gap-2.5">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isRoomChatProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={isRoomChatProcessing}
                                onClick={() => navigate(`/rooms/chat/${roomId}`)}
                                type="button"
                            >
                                <MessageCircle size={22}/>
                            </button>
                        </div>
                    </div>
                </div>
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