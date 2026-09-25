import cn from "../utils/cn";
import useAuthService from "./service";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useAuthStore } from "./store";

export default function SignUp() {
    const auths = useAuthService();
    const navigate = useNavigate();
    
    const emailForSignUp = useAuthStore((state) => state.emailForSignUp);
    const setEmailForSignUp = useAuthStore((state) => state.setEmailForSignUp);

    const passwordForSignUp = useAuthStore((state) => state.passwordForSignUp);
    const setPasswordForSignUp = useAuthStore((state) => state.setPasswordForSignUp);

    const showPasswordForSignUp = useAuthStore((state) => state.showPasswordForSignUp);
    const setShowPasswordForSignUp = useAuthStore((state) => state.setShowPasswordForSignUp);

    const userNameForSignUp = useAuthStore((state) => state.userNameForSignUp);
    const setUserNameForSignUp = useAuthStore((state) => state.setUserNameForSignUp);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    useEffect(() => {
        if (auths.getCurrentUser.data && !auths.getCurrentUser.isLoading) {
            navigate("/home", { replace: true });
        }
    }, [auths.getCurrentUser.data, auths.getCurrentUser.isLoading, navigate]);

    useEffect(() => {
        if (message) {
            const timeOut = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timeOut);
        }
    }, [message, setMessage]);
    
    const passwordToggle = () => setShowPasswordForSignUp(!showPasswordForSignUp);

    return (
        <section className="bg-blue-200 flex justify-center items-center h-dvh p-2">
            <form
                className="bg-white p-2.5 rounded-[10px] w-80 flex flex-col gap-4 border border-blue-700"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    auths.signUpMt.mutate();
                }}
            >
                <div className="flex justify-center"><MessageCircle size={40}/></div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="font-medium text-gray-900">Email</label>
                    <input
                        className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                        id="email"
                        name="email"
                        onChange={(event) => setEmailForSignUp(event.target.value)}
                        type="email"
                        value={emailForSignUp}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="font-medium text-gray-900">Username</label>
                    <input
                        className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                        id="username"
                        name="username"
                        onChange={(event) => setUserNameForSignUp(event.target.value)}
                        type="text"
                        value={userNameForSignUp}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-medium text-gray-900">Password</label>
                    <div className="relative">
                        <input
                            className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black"
                            id="password"
                            name="password"
                            onChange={(event) => setPasswordForSignUp(event.target.value)}
                            type="password"
                            value={passwordForSignUp}
                        />
                        <button
                            className={cn(
                                "text-black font-medium hover:text-gray-700 transition-colors px-3",
                                "absolute inset-y-0 right-0 disabled:cursor-not-allowed cursor-pointer"
                            )}
                            disabled={auths.isProcessing}
                            onClick={passwordToggle}
                            type="button"
                        >
                            {showPasswordForSignUp ? <Eye size={22}/> : <EyeClosed size={22}/>}
                        </button>
                    </div>
                </div>
                <button
                    className={cn(
                        "disabled:cursor-not-allowed transition-colors cursor-pointer bg-blue-700", 
                        "hover:bg-blue-500 text-white font-medium text-[0.9rem] p-1.5 rounded"
                    )}
                    disabled={auths.isProcessing}
                    type="submit"
                >
                    {auths.isProcessing ? "Signing Up..." : "Sign Up"}
                </button>
                {auths.isProcessing || message ? null : (
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