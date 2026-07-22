import cn from "../utils/cn";
import useAuthService from "../services/useAuthService";
import useUserProfileService from "../services/useUserProfileService";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";

export default function SignUp() {
    const navigate = useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { currentUser } = useUserProfileService({ setMessage: setMessage });
    const { 
        email, 
        password, 
        setEmail,
        setPassword, 
        setUserName, 
        signUpMt, 
        username 
    } = useAuthService({ setMessage: setMessage });

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
        <section className="bg-blue-200 flex justify-center items-center h-screen p-2">
            <form
                className="bg-white p-2.5 rounded-[10px] w-80 flex flex-col gap-4 border border-blue-700"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    signUpMt.mutate();
                }}
            >
                <div className="flex justify-center"><MessageCircle size={40}/></div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium text-gray-900">Email</label>
                    <input
                        className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                        id="email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        value={email}
                    />
                </div>
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
                    disabled={signUpMt.isPending}
                    type="submit"
                >
                    {signUpMt.isPending ? "Signing Up..." : "Sign Up"}
                </button>
                {signUpMt.isPending || message ? null : (
                    <div className="justify-center flex gap-1">
                        <div className="text-gray-900">Already have account?</div>
                        <Link className="text-blue-600" to={"/sign-in"}>Sign In</Link>
                    </div>
                )}
                {message ? (
                    <div className="text-red-500 font-medium text-center">{message}</div>
                ) : null}
            </form>
        </section>
    );
}