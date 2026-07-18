import { AudioLines, File, FileText, FileTypeCorner, FolderArchive, Paperclip, Sheet } from "lucide-react";
import type { IFileViewer } from "../models/chat.model";
import cn from "../utils/cn";

export default function FileViewer(props: IFileViewer) {
    return (
        <div className="flex flex-col gap-2.5">
            {props.fileType.startsWith("image/") ? (
                <img 
                    src={props.previewUrl} 
                    className="aspect-square object-cover rounded-lg"
                />
            ) : props.fileType.startsWith("video/") ? (
                <video
                    controls
                    className="aspect-square object-cover rounded-lg"
                    src={props.previewUrl}
                />
            ) : props.fileType.startsWith("audio/") ? (
                <div className="flex justify-center items-center text-gray-500 border border-gray-500 aspect-square rounded">
                    <div className="flex flex-col gap-2 items-center">
                        <AudioLines/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.startsWith("text/plain") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes("/pdf") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <FileTypeCorner/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes("/zip") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <FolderArchive/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes("/sql") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes(".sheet") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <Sheet/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes(".document") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <FileText/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : props.fileType.includes(".presentation") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[1.5rem] rounded"
                    )}>
                        <File/>
                        <div className="line-clamp-1">{props.fileName}</div>
                    </div>
                </div>
            )}
        </div>
    );
}