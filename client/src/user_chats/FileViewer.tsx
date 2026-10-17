import { AudioLines, File, FileText, FileTypeCorner, FolderArchive, Paperclip, Sheet } from "lucide-react";
import type { IFilePreview } from "./model";
import cn from "../utils/cn";

export default function FileViewer(props: IFilePreview) {
    return (
        <>
            {props.file_type.startsWith("image/") ? (
                <img 
                    src={props.url} 
                    className="aspect-square object-cover rounded-lg"
                />
            ) : props.file_type.startsWith("video/") ? (
                <video
                    controls
                    className="aspect-square object-cover rounded-lg"
                    src={props.url}
                />
            ) : props.file_type.startsWith("audio/") ? (
                <div className="flex justify-center items-center text-gray-500 border border-gray-500 aspect-square rounded">
                    <div className="flex flex-col gap-2 items-center">
                        <AudioLines/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.startsWith("text/plain") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes("/pdf") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <FileTypeCorner/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes("/zip") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <FolderArchive/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes("/sql") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes(".sheet") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <Sheet/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes(".document") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <FileText/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : props.file_type.includes(".presentation") ? (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <Paperclip/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <div className={cn(
                        "flex justify-center items-center aspect-square", 
                        "text-gray-500 border border-gray-500 text-[0.9rem] rounded"
                    )}>
                        <File/>
                        <div className="line-clamp-1">{props.file_name}</div>
                    </div>
                </div>
            )}
        </>
    );
}