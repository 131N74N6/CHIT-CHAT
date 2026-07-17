import cn from "../utils/cn";
import Loading from "./Loading";
import UserList from "./UserList";
import type { IRoomMemberWindow } from "../models/room.model";
import { ArrowLeft } from "lucide-react";

export default function RoomMemberWindow(props: IRoomMemberWindow) {
    return (
        <div className="flex flex-col h-full p-2.5">
            <div className="flex">
                <input
                    className={cn(
                        "focus:outline-none bg-gray-500 text-gray-900 font-medium p-1.5 text-[1.2rem] w-full"
                    )}
                    placeholder="find room member..."
                    type="text"
                />
                <button
                    className={cn(
                        "disabled:cursor-not-allowed cursor-pointer", 
                        "hover:text-gray-500 transition-colors text-gray-800 font-medium"
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
                    fetchNextUser={props.fetchNextUser}
                    hasNextPage={props.roomMemberHaveNextPage}
                    isFetchingNextPage={props.isRoomMemberFetchNextPage}
                    isProcessing={props.isRoomMemberLoading}
                    users={props.users}
                />
            )}
        </div>
    );
}