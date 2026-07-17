import type { RoomListIntrf } from "../models/room.model";
import Loading from "./Loading";
import RoomItem from "./RoomItem";

export default function RoomList(props: RoomListIntrf) {
    return (
        <div className="flex flex-col gap-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2">
                {props.rooms.map((room) => {
                    return (
                        <RoomItem 
                            isProcessing={props.isProcessing} 
                            key={room._id}
                            room={room} 
                            setCreatedAt={props.setCreatedAt}
                            setDescription={props.setDescription}
                            setRoomId={props.setRoomId}
                            setRoomName={props.setRoomName}
                            setRoomProfilePicture={props.setRoomProfilePicture}
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