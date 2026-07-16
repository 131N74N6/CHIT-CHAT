import { useNavigate } from "react-router-dom";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import cn from "../utils/cn";
import { ArrowBigLeft, Camera, X } from "lucide-react";
import changeUserService from "../services/change_user.service";
import UserServices from "../services/user.service";

export default function ChangeUser() {
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const { 
        address,
        changeUserMt, 
        fileInputRef,
        gender,
        handleImagePreview,
        isChangeUserProcessing,
        oldProfile,
        profilePicture,
        profilePictureUrl,
        setAddress,
        setDeleteProfilePicture,
        setGender,
        setOldProfilePicture,
        setProfilePicture,
        setProfilePictureUrl,
        setUserName,
        username 
    } = changeUserService({ setMessage: setMessage });

    const { currentUser, isUserProcessing } = UserServices({ setMessage: setMessage });
    const { isUserLoading, user, userError } = currentUser;
    
    useEffect(() => {
        user && user.address ? setAddress(user.address) : setAddress("-");
        user && user.gender ? setGender(user.gender) : setGender("-");
        user && user.username ? setUserName(user.username) : setUserName("-");
        user && user.profile_picture ? setOldProfilePicture(user.profile_picture) : setOldProfilePicture(null);
    }, []);

    return (
        <section className="flex flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserLoading || isUserProcessing}/>
            <form 
                className="flex w-full flex-col h-full p-2.5"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    changeUserMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    onChange={handleImagePreview}
                    ref={fileInputRef}
                    type="file"
                />
                {isUserLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : userError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {userError.message}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white flex flex-col gap-2.5">
                        <div className="flex gap-1.5">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/home`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {profilePicture && profilePictureUrl ? (
                                    <div className="w-full h-full rounded-full relative group">
                                        <img
                                            alt={`user-profile-${Date.now()}`}
                                            className="w-full h-full object-cover"
                                            src={profilePictureUrl}
                                        />
                                        <button
                                            className={cn(
                                                "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                                "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                                "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                            )}
                                            disabled={isChangeUserProcessing || isUserLoading}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                event.stopPropagation();
                                                if (profilePictureUrl) URL.revokeObjectURL(profilePictureUrl);
                                                setProfilePicture(null);
                                                setProfilePictureUrl(null);
                                            }}
                                            type="button"
                                        >
                                            <X size={1}/>
                                        </button>
                                    </div>
                                ) : oldProfile !== null ? (
                                    <div className="w-full h-full rounded-full relative group">
                                        <img
                                            alt={oldProfile.public_id}
                                            className="w-full h-full object-cover"
                                            src={oldProfile.url}
                                        />
                                        <button
                                            className={cn(
                                                "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                                "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                                "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                            )}
                                            disabled={isChangeUserProcessing || isUserLoading}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                event.stopPropagation();
                                                setDeleteProfilePicture(oldProfile);
                                                setOldProfilePicture(null);
                                            }}
                                            type="button"
                                        >
                                            <X size={1}/>
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        className={cn(
                                            "border-dashed border-gray-500 flex justify-center items-center bg-white",
                                            "w-full h-full rounded-full cursor-pointer font-medium text-gray-500"
                                        )}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={14}/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-username" className="text-gray-900 font-medium text-[1.2rem]">Username</label>
                                <input
                                    className={cn("inline-0 bg-gray-400 text-gray-900 font-medium p-1.5 text-[1.2rem] w-full")}
                                    id="new-username"
                                    name="new-username"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setUserName(event.target.value)}
                                    type="text"
                                    value={username}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-gender" className="text-gray-900 font-medium text-[1.2rem]">Gender</label>
                                <select 
                                    disabled={isChangeUserProcessing || isUserLoading}
                                    value={gender}
                                    onChange={(event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => setGender(event.target.value)}
                                    className="bg-gray-400 text-gray-900 p-2 outline-none"
                                >
                                    <option value="">-- Choose Status --</option>
                                    <option value="-">-</option> 
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-address" className="text-gray-900 font-medium text-[1.2rem]">Address</label>
                                <input
                                    className={cn("inline-0 bg-gray-400 text-gray-900 font-medium p-1.5 text-[1.2rem] w-full")}
                                    id="new-address"
                                    name="new-address"
                                    onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setAddress(event.target.value)}
                                    type="text"
                                    value={address}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
}
