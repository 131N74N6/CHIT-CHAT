import { FilesIcon, MessageCircle, SendIcon, X } from "lucide-react";
import cn from "../utils/cn";
import FileViewer from "./FileViewer";
import type { IRoomChatMedia } from "../models/room.model";

export default function RoomMediaPreviewWindow(props: IRoomChatMedia) {
    return (
        <div className="h-full flex-col md:flex md:flex-col hidden">
            <form 
                className="flex flex-col h-full gap-2.5 p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    props.sendChatToRoomMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    id="room-file"
                    multiple
                    name="room-file"
                    onChange={props.handleMediaPreview}
                    ref={props.inputMediaRef}
                    type="file"
                />
                <div 
                    className="border border-dashed cursor-pointer border-gray-600 h-[80%] overflow-y-auto" 
                    onClick={() => props.inputMediaRef.current?.click()}
                >
                    {props.media && props.media.length > 0 ? (
                        <div className="rounded p-2 grid gap-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
                            {props.media.map((media, index) => {
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
                                            disabled={props.isRoomChatProcessing}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                props.removeOnePreviewFile(media.fileName)
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
                        onChange={(event) => props.setText(event.target.value)}
                        value={props.text}
                    />
                    <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                        <div className="flex flex-col gap-2.5">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={props.isRoomChatProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={props.isRoomChatProcessing}
                                onClick={props.seeChat}
                                type="button"
                            >
                                <MessageCircle size={22}/>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}