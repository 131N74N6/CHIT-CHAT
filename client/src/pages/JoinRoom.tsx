import cn from "../utils/cn";
import joinRoomService from "../services/join_room.service";
import Navbar from "../components/Navbar";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";

export default function JoinRoom() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const { isJoinRoomProcessing, joinRoomMt, roomCode, setRoomCode } = joinRoomService({ setMessage: setMessage });

    return (
        <section className="flex flex-col h-screen z-10 relative">
            <Navbar isProcessing={isJoinRoomProcessing}/>
            {message ? <Alert message={message}/> : null}
            <div className="justify-center flex items-center h-full">
                <form 
                    className="bg-white flex flex-col gap-2.5"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        joinRoomMt.mutate();
                    }}
                >
                    <div className="text-center">
                        <div className="font-medium text[1.5rem] text-gray-950 ">
                            By insert room code you will be able to join room
                        </div>
                    </div>
                    <input
                        className="bg-gray-400 text-gray-900 font-medium text-[0.85rem] p-1.5 outline-0"
                        id="room_code"
                        name="room_code"
                        onChange={(event) => setRoomCode(event.target.value)}
                        type="text"
                        value={roomCode}
                    />
                    <button
                        className={cn(
                            "cursor-pointer disabled:cursor-not-allowed bg-gray-400 text-gray-950",  
                            "text-[0.85rem] hover:bg-gray-300 transition-colors font-medium"
                        )}
                        disabled={joinRoomMt.isPending}
                        type="submit"
                    >
                        {joinRoomMt.isPending ? "Joining..." : "Join"}
                    </button>
                </form>
            </div>
        </section>
    );
}
