import cn from "../utils/cn";
import Loading from "./Loading";
import UserList from "./UserList";
import type { IRoomMemberWindow } from "../models/room.model";
import { ArrowLeft } from "lucide-react";

export default function RoomMemberWindow(props: IRoomMemberWindow) {
    return (
        <div className="flex flex-col h-full p-2.5 border border-gray-400 inset-shadow-sm inset-shadow-gray-400">
            <div className="flex">
                <input
                    className="focus:outline-none bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full"
                    placeholder="find room member..."
                    type="text"
                />
                <button
                    className={cn(
                        "disabled:cursor-not-allowed cursor-pointer", 
                        "hover:text-gray-500 transition-colors text-gray-500 font-medium"
                    )}
                    disabled={props.isRoomMemberLoading}
                    onClick={props.seeProfile}
                    type="button"
                >
                    <ArrowLeft/>
                </button>
            </div>
            {props.isRoomMemberLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : props.roomMemberError ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {props.roomMemberError.message}
                    </div>
                </div>
            ) : (
                <UserList
                    currentUserId={props.currentUserId}
                    fetchNextUser={props.fetchNextUser}
                    hasNextPage={props.roomMemberHaveNextPage}
                    isFetchingNextPage={props.isRoomMemberFetchNextPage}
                    place={{ 
                        name: "room-member", 
                        isRoomOwner: props.isRoomOwner, 
                        kickMemberMt: props.kickMemberMt 
                    }}
                    isProcessing={props.isRoomMemberLoading}
                    setReceiverId={props.setReceiverId}
                    users={props?.users}
                />
            )}
        </div>
    );
}