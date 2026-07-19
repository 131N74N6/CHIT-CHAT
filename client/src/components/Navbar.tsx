import { useNavigate } from "react-router-dom";
import useAuthServices from "../services/useAuthServices";
import { Bot, Group, Handshake, Home, Menu, PlusCircle, Power, UserCircle2 } from "lucide-react";
import cn from "../utils/cn";
import { useNavbarStore } from "../stores/navbar.store";

interface INavbar {
    isProcessing?: boolean;
}

export default function Navbar(props?: INavbar) {
    const navigate = useNavigate();
    const { signOutMt } = useAuthServices();

    const navbarOpen = useNavbarStore((state) => state.navbarOpen);
    const setNavbarOpen = useNavbarStore((state) => state.setNavbarOpen);

    const navbarToggle = () => setNavbarOpen(!navbarOpen);

    return (
        <>
            <nav 
                className={cn(
                    "bg-white md:w-1/5 w-full inset-shadow-sm inset-shadow-gray-400", 
                    "md:flex hidden flex-col gap-2.5 p-2.5 border border-gray-400"
            )}>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/home")}
                    type="button"
                >
                    <Home size={23}/>
                    <div>Home</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms")}
                    type="button"
                >
                    <Group size={23}/>
                    <div>Rooms</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms/create")}
                    type="button"
                >
                    <PlusCircle size={23}/>
                    <div>Create Room</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms/join")}
                    type="button"
                >
                    <Handshake size={23}/>
                    <div>Join Room</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/chatbot")}
                    type="button"
                >
                    <Bot size={23}/>
                    <div>Chatbot</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/profile")}
                    type="button"
                >
                    <UserCircle2 size={23}/>
                    <div>Your Profile</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => signOutMt.mutate()}
                    type="button"
                >
                    <Power size={23}/>
                    <div>Sign Out</div>
                </button>
            </nav>
            <nav className="md:hidden flex p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400">
                <button
                    className="disabled:cursor-not-allowed cursor-pointer text-gray-400 font-medium"
                    disabled={props?.isProcessing}
                    onClick={navbarToggle}
                    type="button"
                >
                    <Menu size={23}/>
                </button>
            </nav>
            {navbarOpen ? (
                <div className="cursor-pointer fixed inset-0 z-40 md:hidden" onClick={navbarToggle}></div>
            ) : null}
            <aside
                className={cn(
                    "bg-white w-4/5 max-w-sm inset-shadow-sm inset-shadow-gray-400 p-2.5 z-50 md:hidden",
                    `fixed top-0 right-0 h-full ${navbarOpen ? 'translate-x-0' : 'translate-x-full' }`,
                    "flex flex-col gap-2.5 transform transition-transform duration-300 ease-in-out"
                )}
            >
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/home")}
                    type="button"
                >
                    <Home size={23}/>
                    <div>Home</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms")}
                    type="button"
                >
                    <Group size={23}/>
                    <div>Rooms</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms/create")}
                    type="button"
                >
                    <PlusCircle size={23}/>
                    <div>Create Room</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/rooms/join")}
                    type="button"
                >
                    <Handshake size={23}/>
                    <div>Join Room</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/chatbot")}
                    type="button"
                >
                    <Bot size={23}/>
                    <div>Chatbot</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => navigate("/profile")}
                    type="button"
                >
                    <UserCircle2 size={23}/>
                    <div>Your Profile</div>
                </button>
                <button
                    className={cn(
                        "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                        "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                    )}
                    disabled={props?.isProcessing}
                    onClick={() => signOutMt.mutate()}
                    type="button"
                >
                    <Power size={23}/>
                    <div>Sign Out</div>
                </button>
            </aside>
        </>
    );
}