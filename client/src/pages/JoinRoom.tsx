import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import { MessageCircle } from "lucide-react";
import useUserProfileService from "../services/useUserProfileService";

export default function JoinRoom() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { isUserProfileProcessing, joinRoomMt, roomCode, setRoomCode } = useUserProfileService({ setMessage: setMessage });
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-screen relative z-10">
            <Navbar isProcessing={isUserProfileProcessing}/>
            {message ? <Alert message={message}/> : null}
            <div 
                className={cn(
                    "justify-center w-full md:w-2/5 flex items-center", 
                    "h-full inset-shadow-sm inset-shadow-gray-400 border",
                    "border border-gray-400"
                )}>
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
                        className="bg-blue-200 text-gray-900 font-medium text-[0.85rem] p-1.5 outline-0"
                        id="room_code"
                        name="room_code"
                        onChange={(event) => setRoomCode(event.target.value)}
                        type="text"
                        value={roomCode}
                    />
                    <button
                        className={cn(
                            "cursor-pointer disabled:cursor-not-allowed bg-blue-200 text-gray-950",  
                            "text-[0.85rem] hover:bg-gray-300 p-1.5 transition-colors font-medium"
                        )}
                        disabled={joinRoomMt.isPending}
                        type="submit"
                    >
                        {joinRoomMt.isPending ? "Joining..." : "Join"}
                    </button>
                </form>
            </div>
            <div 
                className={cn(
                    "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                    "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                    "border border-gray-400"
                )}
            >
                <div className="flex flex-col gap-2">
                    <div className="text-gray-500 font-medium flex justify-center">
                        <MessageCircle size={34}/>
                    </div>
                    <div className="text-gray-700 font-medium text-center">
                        Welcome to Chit Chat
                    </div>
                </div>
            </div>
        </section>
    );
}
