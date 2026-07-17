import { ArrowBigLeft } from "lucide-react";
import cn from "../utils/cn";
import Loading from "./Loading";
import type { IRoomProfileWindow } from "../models/room.model";

export default function RoomProfileWindow(props: IRoomProfileWindow) {
    return (
        <div className="flex w-full flex-col h-full bg-gray-400 gap-2.5 p-1.5">
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
            ) : (
                <div className="bg-white flex flex-col p-2.5 gap-2.5">
                    <div className="flex">
                        <button
                            className={cn(
                                "disabled:cursor-not-allowed cursor-pointer", 
                                "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                            )}
                            disabled={props.isProcessing || props.isRoomProfileLoading}
                            onClick={props.seeRoomChat}
                            type="button"
                        >
                            <ArrowBigLeft size={24}/>
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full">
                            {props.roomProfile.profile_picture && props.roomProfile.profile_picture !== null ? (
                                <div className="w-full h-full rounded-full">
                                    <img
                                        alt={props.roomProfile.profile_picture.public_id}
                                        className="w-full h-full object-cover"
                                        src={props.roomProfile.profile_picture.url}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-blue-600 text-white font-medium text-2xl",
                                    "flex justify-center items-center w-full h-full rounded-full"
                                )}>
                                    {props.roomProfile.name[0]}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Created At</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.roomProfile.created_at || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Room ID</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.roomProfile._id || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Name</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.roomProfile.name || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Description</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.roomProfile.description || "-"}
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {props.isRoomOwner ? (
                            <button
                                className={cn(
                                    "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                    "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                                )}
                                disabled={props.isProcessing}
                                onClick={() => props.deleteRoomMt.mutate()}
                                type="button"
                            >
                                Delete room
                            </button>
                        ) : (
                            <button
                                className={cn(
                                    "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-red-600", 
                                    "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                                )}
                                disabled={props.isProcessing}
                                onClick={() => props.leftRoomMt.mutate()}
                            >
                                Left room
                            </button>
                        )}
                        <button
                            className={cn(
                                "bg-gray-400 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                "text-[0.8rem] hover:bg-gray-500 transition-colors font-medium p-1.5"
                            )}
                            disabled={props.isProcessing}
                            type="button"
                            onClick={props.seeMember}
                        >
                            See Room Member
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}