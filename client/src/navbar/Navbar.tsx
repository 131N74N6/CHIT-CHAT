import { useNavigate } from "react-router-dom";
import useAuthServices from "../auths/service";
import { Bot, Group, Handshake, Home, Menu, PlusCircle, Power, Settings, UserCircle2 } from "lucide-react";
import cn from "../utils/cn";
import { useNavbarStore } from "./store";

interface INavbar {
    isProcessing?: boolean;
}

const asideItems = [
    { label: "Home", path: "/home", icon: Home },
    { label: "Chatbot", path: "/chatbot", icon: Bot },
    { label: "Groups", path: "/rooms", icon: Group },
    { label: "Create Group", path: "/rooms/create", icon: PlusCircle },
    { label: "Join Group", path: "/rooms/join", icon: Handshake },
    { label: "Your Profile", path: "/profile", icon: UserCircle2 },
    { label: "Settings", path: "/settings", icon: Settings },
];

export default function Navbar(props?: INavbar) {
    const navigate = useNavigate();
    const { signOutMt } = useAuthServices();

    const navbarOpen = useNavbarStore((state) => state.navbarOpen);
    const setNavbarOpen = useNavbarStore((state) => state.setNavbarOpen);

    const navbarToggle = () => setNavbarOpen(!navbarOpen);

    return (
        <>
            <aside 
                className={cn(
                    "bg-white md:w-1/4 w-full inset-shadow-sm inset-shadow-gray-400", 
                    "md:flex hidden flex-col gap-2.5 p-2.5 border border-gray-400"
            )}>
                {asideItems.map(asideItem => {
                    const Icon = asideItem.icon;

                    return (
                        <button
                            className={cn(
                                "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                                "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                            )}
                            disabled={props?.isProcessing}
                            key={asideItem.path}
                            onClick={() => navigate(asideItem.path)}
                            type="button"
                        >
                            <Icon size={23}/>
                            <div>{asideItem.label}</div>
                        </button>
                    );
                })}
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
                {asideItems.map(asideItem => {
                    const Icon = asideItem.icon;

                    return (
                        <button
                            className={cn(
                                "flex gap-1.5 cursor-pointer disabled:cursor-not-allowed text-gray-900 p-1.5",
                                "font-medium text-left bg-white hover:bg-blue-200 transition-colors"
                            )}
                            disabled={props?.isProcessing}
                            key={asideItem.path}
                            onClick={() => {
                                navigate(asideItem.path);
                                navbarToggle();
                            }}
                            type="button"
                        >
                            <Icon size={23}/>
                            <div>{asideItem.label}</div>
                        </button>
                    );
                })}
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