import { 
    AudioLines, Database, File, Download, FileChartColumn, 
    FileText, FileTypeCorner, FolderArchive, Paperclip, Sheet, Table 
} from "lucide-react";
import type { IChatMedia, IChatMediaList } from "../models/chat.model";
import cn from "../utils/cn";

export default function FileDetail(props: IChatMediaList) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2.5 p-2.5 overflow-y-auto">
            {props.files.map(file => (
                <FileIcon file={file} is_processing={props.is_processing}/>
            ))}
        </div>
    );
}

function FileIcon(props: IChatMedia) {
    const downloadFile = async () => {
        try {
            const response = await fetch(props.file.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = props.file.public_id || "download";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            window.open(props.file.url, "_blank");
        }
    };

    return (
        <div className="">
            {props.file.file_type.startsWith('image/') ? (
                <div className="relative">
                    <img 
                        src={props.file.url} 
                        className="aspect-square object-cover rounded-lg"
                    />
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.startsWith('video/') ? (
                <div className="relative">
                    <video 
                        src={props.file.url}
                        className="aspect-square object-cover rounded-lg"
                        controls
                    />
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.startsWith('audio/') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <AudioLines></AudioLines>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.startsWith('text/csv') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <Table></Table>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) :props.file.file_type.startsWith('text/plain') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <Paperclip></Paperclip>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('/pdf') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <FileTypeCorner></FileTypeCorner>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('/zip') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <FolderArchive></FolderArchive>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('/sql') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <Database></Database>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('.sheet') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <Sheet></Sheet>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('.document') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <FileText></FileText>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : props.file.file_type.includes('.presentation') ? (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <FileChartColumn></FileChartColumn>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center text-gray-700 border border-gray-700 aspect-square rounded-lg relative">
                    <div className="flex flex-col gap-4 items-center">
                        <File></File>
                        <p className="line-clamp-1">{props.file.file_name}</p>
                    </div>
                    <button 
                        type="button" 
                        disabled={props.is_processing}
                        className={cn(
                            "cursor-pointer flex gap-2 items-center bg-gray-600 text-white p-1.5 text-sm rounded-md", 
                            "hover:bg-gray-400 transition-colors disabled:cursor-not-allowed absolute top-1 right-1"
                        )}
                        onClick={downloadFile}
                    >
                        <Download></Download>
                        <div>Download</div>
                    </button>
                </div>
            )}
        </div>
    );
}