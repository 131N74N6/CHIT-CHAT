import { ImageMinus, UserMinus, UserPen } from "lucide-react";
import useAuthService from "../auths/service";
import Navbar from "../navbar/Navbar";
import useUserProfileService from "../user_profiles/service";
import cn from "../utils/cn";
import { useUserStore } from "../user_profiles/store";
import { useNavigate } from "react-router-dom";

export default function Settings() {
    const navigate = useNavigate();
    const setEditMode = useUserStore((state) => state.setEditMode);
    
    const owner = useAuthService();
    const userProfile = useUserProfileService();
    
    return (
        <section className="flex md:flex-row flex-col relative z-10 h-dvh gap-2 p-2">
            <Navbar isProcessing={owner.isProcessing || userProfile.isProcessing}/>
            <main 
                className={cn(
                    "md:w-3/4 w-full h-full flex flex-col overflow-y-auto gap-2 p-2", 
                    "border border-gray-400 inset-shadow-sm inset-shadow-gray-400"
                )}>
                <button
                    className={cn(
                        "text-gray-100 disabled:cursor-not-allowed cursor-pointer bg-gray-800", 
                        "hover:bg-gray-500 transition-colors px-2.5 py-1.5 rounded-md font-medium"
                    )}
                    onClick={() => userProfile.deleteUserProfilePictureMt.mutate()}
                    type="button"
                >
                    <section className="flex flex-row gap-3 items-center">
                        <div className="text-white"><ImageMinus size={24}/></div>
                        <div className="flex flex-col gap-2">
                            <p className="text-white font-medium text-left text-base">Remove Profile Picture</p>
                            <p className="text-white text-left font-medium text-sm">
                                Remove your current profile picture with one click.
                            </p>
                        </div>
                    </section>
                </button>
                <button
                    className={cn(
                        "text-gray-100 disabled:cursor-not-allowed cursor-pointer bg-gray-800", 
                        "hover:bg-gray-500 transition-colors px-2.5 py-1.5 rounded-md font-medium"
                    )}
                    onClick={() => userProfile.deleteUserMt.mutate()}
                    type="button"
                >
                    <section className="flex flex-row gap-3 items-center">
                        <div className="text-white"><UserMinus size={24}/></div>
                        <div className="flex flex-col gap-2">
                            <p className="text-white font-medium text-left text-base">Delete this account</p>
                            <p className="text-white text-left font-medium text-sm">
                                Once you click this, your messages, your groups, your files, and your chatbot histories.
                                You cannot access this account forever.
                            </p>
                        </div>
                    </section>
                </button>
                <button
                    className={cn(
                        "text-gray-100 disabled:cursor-not-allowed cursor-pointer bg-gray-800", 
                        "hover:bg-gray-500 transition-colors px-2.5 py-1.5 rounded-md font-medium"
                    )}
                    onClick={() => {
                        setEditMode(true);
                        navigate("/profile");
                    }}
                    type="button"
                >
                    <section className="flex flex-row gap-3 items-center">
                        <div className="text-white"><UserPen size={24}/></div>
                        <div className="flex flex-col gap-2">
                            <p className="text-white font-medium text-left text-base">Edit Profile</p>
                            <p className="text-white text-left font-medium text-sm">
                                Change your account profile here.
                            </p>
                        </div>
                    </section>
                </button>
            </main>
        </section>
    )
}
