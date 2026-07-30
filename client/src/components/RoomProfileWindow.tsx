import { ArrowBigLeft, Camera, X } from "lucide-react";
import cn from "../utils/cn";
import Loading from "./Loading";
import type { IRoomProfileWindow } from "../models/room.model";

export default function RoomProfileWindow(props: IRoomProfileWindow) {
    return (
        <div className="h-full flex-col md:flex md:flex-col hidden">
            {props.isRoomProfileLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : props.roomProfileError ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {props.roomProfileError.message}
                    </div>
                </div>
            ) : props.editMode ? (
                <form 
                    className="flex flex-col h-full gap-2.5 p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400" 
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        props.changeRoomMt.mutate();
                    }}
                >
                    <input
                        className="hidden"
                        onChange={props.handleImagePreview}
                        ref={props.fileInputRef}
                        type="file"
                    />
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full">
                            {props.selectedProfileRoom && props.selectedProfileRoomUrl ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={`room-img-${Date.now()}`}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.selectedProfileRoomUrl}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={props.isRoomProfileProcessing}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.stopPropagation();
                                            if (props.selectedProfileRoomUrl) URL.revokeObjectURL(props.selectedProfileRoomUrl);
                                            props.setSelectedProfileRoom(null);
                                            props.setSelectedProfileRoomUrl(null);
                                        }}
                                        type="button"
                                    >
                                        <X size={1}/>
                                    </button>
                                </div>
                            ) : props.oldRoomPicture ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={props.oldRoomPicture.public_id}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.oldRoomPicture.url}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={props.isRoomProfileProcessing}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.stopPropagation();
                                            props.setDeleteRoomImage(props.oldRoomPicture);
                                            props.setOldRoomPicture(null);
                                        }}
                                        type="button"
                                    >
                                        <X size={1}/>
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    className={cn(
                                        "border-dashed border-gray-500 flex justify-center items-center bg-white",
                                        "w-full h-full rounded-full cursor-pointer font-medium text-gray-500"
                                    )}
                                    onClick={() => props.fileInputRef.current?.click()}
                                >
                                    <Camera size={22}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="room_name" className="text-gray-900 font-medium text-[1rem]">Room name</label>
                        <input
                            className={cn("outline-0 bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                            id="room_name"
                            name="room_name"
                            onChange={(event) => props.setRoomName(event.target.value)}
                            type="text"
                            value={props.roomName}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="room_description" className="text-gray-900 font-medium text-[1rem]">Description</label>
                        <input
                            className={cn(
                                "outline-0 bg-gray-200 text-gray-900 font-medium text-[1rem]", 
                                "p-1.5 w-full max-h-80 overflow-y-auto"
                            )}
                            id="room_description"
                            name="room_description"
                            onChange={(event) => props.setDescription(event.target.value)}
                            type="text"
                            value={props.description}
                        />
                    </div>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={props.isRoomProfileProcessing}
                        type="submit"
                    >
                        {props.isRoomProfileProcessing ? "Saving..." : "Save"}
                    </button>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={props.isRoomProfileProcessing}
                        onClick={() => props.setEditMode(false)}
                        type="button"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <div className="flex flex-col h-full gap-2.5 p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400">
                    <div className="bg-white flex flex-col p-2.5 gap-2.5">
                        <div className="flex">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={props.seeRoomChat}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {props.roomProfile && props.roomProfile.profile_picture !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={props.roomProfile.profile_picture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={props.roomProfile.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {props.roomProfile?.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Created At</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.roomProfile && props.roomProfile.created_at ? props.roomProfile.created_at : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Room ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.roomProfile && props.roomProfile._id ? props.roomProfile._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.roomProfile && props.roomProfile.name ? props.roomProfile.name : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Description</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.roomProfile && props.roomProfile.description !== null ? props.roomProfile.description : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {props.isRoomOwner ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={props.isRoomProfileProcessing}
                                        onClick={() => props.deleteRoomMt.mutate()}
                                        type="button"
                                    >
                                        Delete room
                                    </button>
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={props.isRoomProfileProcessing}
                                        onClick={() => props.setEditMode(true)}
                                        type="button"
                                    >
                                        Edit room profile
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={cn(
                                        "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-red-600", 
                                        "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                    )}
                                    disabled={props.isRoomProfileProcessing}
                                    onClick={() => props.leftRoomMt.mutate()}
                                >
                                    Left room
                                </button>
                            )}
                            <button
                                className={cn(
                                    "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                )}
                                disabled={props.isRoomProfileProcessing}
                                type="button"
                                onClick={props.seeMember}
                            >
                                See Room Member
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}