import cn from "../utils/cn";
import Navbar from "../navbar/Navbar";
import { useMessageStore } from "../alert/store";
import { useEffect } from "react";
import Alert from "../alert/Alert";
import useGroupMemberService from "./service";
import { useUserStore } from "../user_profiles/store";

export default function JoinGroup() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const roomCode = useUserStore((state) => state.roomCode);
    const setRoomCode = useUserStore((state) => state.setRoomCode);

    const groupMember = useGroupMemberService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row flex-col gap-2 p-2 h-dvh relative z-10">
            <Navbar isProcessing={groupMember.isProcessing}/>
            {message ? <Alert message={message}/> : null}
            <main 
                className={cn(
                    "justify-center w-full md:w-3/4 flex items-center", 
                    "h-full inset-shadow-sm inset-shadow-gray-400 border",
                    "border border-gray-400"
                )}>
                <form 
                    className="bg-white flex flex-col gap-2.5"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        groupMember.joinGroupMt.mutate();
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
                        disabled={groupMember.isProcessing}
                        type="submit"
                    >
                        {groupMember.joinGroupMt.isPending ? "Joining..." : "Join"}
                    </button>
                </form>
            </main>
        </section>
    );
}
