import cn from "../utils/cn";
import useUserProfileService from "../services/useUserProfileService";
import useAuthService from "../services/useAuthService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeClosed, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";

export default function SignIn() {
    const navigate = useNavigate();
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const { 
        password, 
        setPassword, 
        setShowPassword, 
        setUserName, 
        signInMt, 
        showPassword, 
        username 
    } = useAuthService();

    const { currentUser } = useUserProfileService();

    useEffect(() => {
        if (currentUser.data && !currentUser.isLoading) navigate("/home", { replace: true });
    }, [currentUser.data, currentUser.isLoading, navigate]);
    
    useEffect(() => {
        if (message) {
            const timeOut = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timeOut);
        }
    }, [message, setMessage]);
    
    const passwordToggle = () => setShowPassword(!showPassword);

    return (
        <section className="bg-blue-200 flex justify-center items-center h-dvh">
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
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="font-medium text-gray-900">Password</label>
                    <div className="relative">
                        <input
                            className="bg-blue-100 p-2 text-[0.85rem] font-medium w-full focus:outline-none text-black pr-10"
                            id="password"
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}
                            type={showPassword ? "text" : "password"}
                            value={password}
                        />
                        <button
                            className={cn(
                                "text-black font-medium hover:text-gray-700 transition-colors px-3",
                                "absolute inset-y-0 right-0 disabled:cursor-not-allowed cursor-pointer"
                            )}
                            disabled={signInMt.isPending}
                            onClick={passwordToggle}
                            type="button"
                        >
                            {showPassword ? <Eye size={22}/> : <EyeClosed size={22}/>}
                        </button>
                    </div>
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