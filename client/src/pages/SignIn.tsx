import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import useAuthServices from "../services/useAuthServices";
import { Link, useNavigate } from "react-router-dom";
import useUserServices from "../services/useUserServices";
import cn from "../utils/cn";
import { MessageCircle } from "lucide-react";

export default function SignIn() {
    const navigate = useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { password, setPassword, setUserName, signInMt, username } = useAuthServices({ setMessage: setMessage });
    const { currentUser } = useUserServices({ setMessage: setMessage });

    useEffect(() => {
        if (currentUser.user && !currentUser.isUserLoading) navigate("/home", { replace: true });
    }, [currentUser.user, currentUser.isUserLoading, navigate]);
    
    useEffect(() => {
        if (message) {
            const timeOut = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timeOut);
        }
    }, [message, setMessage]);
    

    return (
        <section className="bg-blue-200 flex justify-center items-center h-screen">
            <form
                className="bg-white p-2.5 rounded-[10px] flex flex-col gap-4 w-80 border border-blue-700"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    signInMt.mutate();
                }}
            >
                <div className="flex justify-center"><MessageCircle size={40}/></div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="font-medium text-gray-900">Username</label>
                    <input
                        className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                        id="username"
                        name="username"
                        onChange={(event) => setUserName(event.target.value)}
                        type="text"
                        value={username}
                    />
                </div>
                <div className="flex flex-col gap-2 relative">
                    <label htmlFor="password" className="font-medium text-gray-900">Password</label>
                    <input
                        className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                        id="password"
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        value={password}
                    />
                </div>
                <button
                    className={cn(
                        "disabled:cursor-not-allowed transition-colors cursor-pointer bg-blue-700", 
                        "hover:bg-blue-500 text-white font-medium text-[0.9rem] p-1.5 rounded"
                    )}
                    disabled={signInMt.isPending}
                    type="submit"
                >
                    {signInMt.isPending ? "Signing In..." : "Sign In"}
                </button>
                {signInMt.isPending || message ? null : (
                    <div className="flex justify-center gap-1">
                        <div className="text-gray-900">Don't have any account?</div>
                        <Link className="text-blue-600" to={"/sign-up"}>Sign Up</Link>
                    </div>
                )}
                {message ? (
                    <div className="text-red-500 font-medium text-center">{message}</div>
                ) : null}
            </form>
        </section>
    );
}