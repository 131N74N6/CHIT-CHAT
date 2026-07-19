import type { RoomListIntrf } from "../models/room.model";
import Loading from "./Loading";
import RoomItem from "./RoomItem";

export default function RoomList(props: RoomListIntrf) {
    if (props.rooms.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No rooms available...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col py-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2">
                {props.rooms.map((room) => {
                    return (
                        <RoomItem 
                            isProcessing={props.isProcessing} 
                            key={room._id}
                            room={room} 
                            setRoomId={props.setRoomId}
                        />
                    );
                })}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : props.rooms.length <= 14 ? (
                    <></>
                ) : props.hasNextPage ? (
                    <button
                        disabled={props.isProcessing}
                        className={`
                            cursor-pointer disabled:cursor-not-allowed bg-gray-400 
                            text-gray-950 font-medium p-1.5 text-[0.8rem] hover:bg-gray-300 transition-colors
                        `}
                        onClick={() => props.fetchNextPage()}
                        type="button"
                    >
                        Load more
                    </button>
                ) : (
                    <div className="text-center text-[0.8rem] text-gray-950 font-medium">No more room to show</div>
                )}
            </div>
        </div>
    );
}