import Navbar from "../navbar/Navbar";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { FilesIcon, MessageCircle, SendIcon, X } from "lucide-react";
import cn from "../utils/cn";
import FileViewer from "../components/FileViewer";
import Alert from "../components/Alert";
import { useNavigate, useParams } from "react-router-dom";
import useGroupChatService from "./service";
import { useGroupChatStore } from "./store";

export default function GroupChatFilesPreview() {
    const { room_id } = useParams();
    const navigate = useNavigate();
    
    const chosenFiles = useGroupChatStore((state) => state.chosenFiles);
    const removeOneFile = useGroupChatStore((state) => state.removeOneFile);

    const groupId = useGroupChatStore((state) => state.groupId);
    const setGroupId = useGroupChatStore((state) => state.setGroupId);

    const groupMessage = useGroupChatStore((state) => state.groupMessage);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const groupChat = useGroupChatService();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (room_id) setGroupId(room_id);
    }, [room_id, setGroupId]);

    return (
        <section className="flex md:flex-row flex-col h-dvh gap-2.5 p-2.5 relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={groupChat.isProcessing}/>
            <form 
                className="flex flex-col h-full gap-2.5 p-2.5 md:w-2/5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    groupChat.sendChatToGroup.mutate();
                }}
            >
                <input
                    className="hidden"
                    id="room-file"
                    multiple
                    name="room-file"
                    onChange={groupChat.handleMediaPreview}
                    ref={groupChat.inputMediaRef}
                    type="file"
                />
                <div 
                    className="border border-dashed cursor-pointer border-gray-600 h-[80%] overflow-y-auto" 
                    onClick={() => groupChat.inputMediaRef.current?.click()}
                >
                    {chosenFiles.length > 0 ? (
                        <div className="rounded p-2 grid gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                            {chosenFiles.map((chosenFile, index) => {
                                return (
                                    <div className=" relative group">
                                        <FileViewer
                                            file={chosenFile.file}
                                            fileName={chosenFile.file_name}
                                            fileType={chosenFile.file_type}
                                            key={`file-in-room-${index}`}
                                            previewUrl={chosenFile.url}
                                        />
                                        <button
                                            className={cn(
                                                "transition-opacity duration-300 ease-in-out cursor-pointer absolute top-1 right-1", 
                                                "text-white font-medium bg-red-600 w-6 h-6 rounded-full flex justify-center items-center"
                                            )}
                                            disabled={groupChat.isProcessing}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeOneFile(chosenFile.file_name)
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
                        onChange={(event) => setGroupMessage(event.target.value)}
                        value={groupMessage}
                    />
                    <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                        <div className="flex flex-col gap-2.5">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={groupChat.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={groupChat.isProcessing}
                                onClick={() => navigate(`/rooms/chat/${groupId}`)}
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
