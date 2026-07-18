import { useNavigate } from "react-router-dom";
import useAuthServices from "../services/useAuthServices";
import { Bot, Group, Handshake, Home, Power, UserCircle2 } from "lucide-react";

interface INavbar {
    isProcessing?: boolean;
}

export default function Navbar(props?: INavbar) {
    const navigate = useNavigate();
    const { signOutMt } = useAuthServices();

    return (
        <>
            <nav className="bg-white w-[10%] inset-shadow-sm inset-shadow-gray-400 md:flex hidden flex-col gap-2.5 p-2.5">
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/home")}
                    type="button"
                >
                    <Home size={23}/>
                </button>
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms")}
                    type="button"
                >
                    <Group size={23}/>
                </button>
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/join-room")}
                    type="button"
                >
                    <Handshake size={23}/>
                </button>
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/chatbot")}
                    type="button"
                >
                    <Bot size={23}/>
                </button>
                
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/profile")}
                    type="button"
                >
                    <UserCircle2 size={23}/>
                </button>
                <button
                    className={`
                        cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                        font-medium bg-white hover:bg-gray-400 transition-colors
                    `}
                    disabled={props?.isProcessing}
                    onClick={() => signOutMt.mutate()}
                    type="button"
                >
                    <Power size={23}/>
                </button>
            </nav>
            <nav className="md:hidden flex p-2.5">
                <aside>
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => navigate("/home")}
                        type="button"
                    >
                        Home
                    </button>
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => navigate("/rooms")}
                        type="button"
                    >
                        Room
                    </button>
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => navigate("/join-room")}
                        type="button"
                    >
                        Join Room
                    </button>
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => navigate("/chatbot")}
                        type="button"
                    >
                        Chatbot
                    </button>
                    
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => navigate("/profile")}
                        type="button"
                    >
                        Profile
                    </button>
                    <button
                        className={`
                            cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5
                            font-medium bg-white hover:bg-gray-400 transition-colors
                        `}
                        disabled={props?.isProcessing}
                        onClick={() => signOutMt.mutate()}
                        type="button"
                    >
                        Sign Out
                    </button>
                </aside>
            </nav>
        </>
    );
}