import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import UserList from "../components/UserList";
import roomMemberService from "../services/room_member.service";
import cn from "../utils/cn";

export default function RoomMember() {
    const { currentRoomMember } = roomMemberService();

    return (
        <section className="flex flex-col h-screen relative z-10">
            <Navbar isProcessing={currentRoomMember.isRoomMemberLoading}/>
            <div className="flex flex-col h-full p-2.5">
                <div className="flex">
                    <input
                        className={cn(
                            "focus:outline-none bg-gray-500 text-gray-900 font-medium p-1.5 text-[1.2rem] w-full"
                        )}
                        placeholder="find room member..."
                        type="text"
                    />
                </div>
                {currentRoomMember.isRoomMemberLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : currentRoomMember.roomMemberError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {currentRoomMember.roomMemberError.message}
                        </div>
                    </div>
                ) : (
                    <UserList
                        fetchNextUser={currentRoomMember.fetchNextRoomMember}
                        hasNextPage={currentRoomMember.roomMmeberHaveNextPage}
                        isFetchingNextPage={currentRoomMember.isRoomMemberFetchNextPage}
                        isProcessing={currentRoomMember.isRoomMemberLoading}
                        users={currentRoomMember.roomMember}
                    />
                )}
            </div>
        </section>
    );
}