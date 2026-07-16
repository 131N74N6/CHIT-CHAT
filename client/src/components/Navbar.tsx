import { useNavigate } from "react-router-dom";
import AuthServices from "../services/auth.service";

interface INavbar {
    isProcessing?: boolean;
}

export default function Navbar(props?: INavbar) {
    const navigate = useNavigate();
    const { signOutMt } = AuthServices();

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
            </nav>
        </>
    );
}