import { MessageCircle, FilesIcon, SendIcon, X } from "lucide-react";
import FileViewer from "../components/FileViewer";
import cn from "../utils/cn";
import { useUserChatStore } from "./store";
import type { IUserChatFilesPreviewPopUp } from "./model";
import { useUserStore } from "../user_profiles/store";

export default function UserChatFilesPreviewPopUp(props: IUserChatFilesPreviewPopUp) {
    const text = useUserChatStore((state) => state.text);
    const setText = useUserChatStore((state) => state.setText);

    const chosenFiles = useUserChatStore((state) => state.chosenFiles);
    const removeOneFile = useUserChatStore((state) => state.removeOneFile);
    
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);
    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);

    const seeUserChat = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(true);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
            <form 
                className="flex flex-col h-full gap-2.5 p-2.5 md:w-2/5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    props.sendMessageMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    id="user-chat-file"
                    multiple
                    name="user-chat-file"
                    onChange={props.handleMediaPreview}
                    ref={props.inputMediaRef}
                    type="file"
                />
                <div 
                    className="border border-dashed cursor-pointer border-gray-600 h-[80%] overflow-y-auto" 
                    onClick={() => props.inputMediaRef.current?.click()}
                >
                    {chosenFiles.length > 0 ? (
                        <div className="rounded p-2 grid gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                            {chosenFiles.map((chosenFile, index) => {
                                return (
                                    <div className=" relative group">
                                        <FileViewer
                                            file={chosenFile.file}
                                            fileName={chosenFile.file_type}
                                            fileType={chosenFile.file_type}
                                            key={`file-in-room-${index}`}
                                            previewUrl={chosenFile.url}
                                        />
                                        <button
                                            className={cn(
                                                "transition-opacity duration-300 ease-in-out cursor-pointer absolute top-1 right-1", 
                                                "text-white font-medium bg-red-600 w-6 h-6 rounded-full flex justify-center items-center"
                                            )}
                                            disabled={props.isProcessing}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeOneFile(chosenFile.file_type)
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
                                disabled={props.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={props.isProcessing}
                                onClick={seeUserChat}
                                type="button"
                            >
                                <MessageCircle size={22}/>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
}
