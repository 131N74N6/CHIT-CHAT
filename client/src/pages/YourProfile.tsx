import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../services/useUserProfileService";
import { useMessageStore } from "../stores/message.store";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, MessageCircle, Pen } from "lucide-react";
import Alert from "../components/Alert";
import cn from "../utils/cn";

export default function YourProfile() {
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const { 
        address,
        changeUserMt, 
        currentUser, 
        editMode,
        fileInputRef,
        gender,
        handleImagePreview,
        isUserProfileProcessing, 
        oldProfile,
        profilePicture,
        profilePictureUrl,
        setAddress,
        setDeleteProfilePicture,
        setEditMode,
        setGender,
        setOldProfilePicture,
        setProfilePicture,
        setProfilePictureUrl,
        setUserName,
        username, 
    } = useUserService({ setMessage: setMessage });

    const { isUserLoading, user, userError } = currentUser;

    useEffect(() => {
        if (editMode) {
            user && user.address ? setAddress(user.address) : setAddress("-");
            user && user.gender ? setGender(user.gender) : setGender("-");
            user && user.username ? setUserName(user.username) : setUserName("-");
            user && user.profile_picture ? setOldProfilePicture(user.profile_picture) : setOldProfilePicture(null);
        } else {
            setAddress("");
            setGender("");
            setUserName("");
            setOldProfilePicture(null);
        }
    }, [editMode, currentUser.user]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row gap-2.5 p-2.5 flex-col relative h-screen z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserLoading || isUserProfileProcessing}/>
            {editMode ? (
                <form 
                    className="flex w-full md:w-2/5 flex-col h-full p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        changeUserMt.mutate();
                    }}
                >
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
                            <input
                                className="hidden"
                                onChange={handleImagePreview}
                                ref={fileInputRef}
                                type="file"
                            />
                            <div className="flex gap-1.5">
                                <button
                                    className={cn(
                                        "disabled:cursor-not-allowed cursor-pointer", 
                                        "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                    )}
                                    disabled={isUserProfileProcessing}
                                    onClick={() => setEditMode(false)}
                                    type="button"
                                >
                                    <ArrowBigLeft size={24}/>
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full">
                                    {profilePicture && profilePictureUrl ? (
                                        <div className="w-full h-full relative group">
                                            <img
                                                alt={`user-profile-${Date.now()}`}
                                                className="w-full h-full object-cover rounded-full"
                                                src={profilePictureUrl}
                                            />
                                            <button
                                                className={cn(
                                                    "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                                    "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                                    "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                                )}
                                                disabled={isUserProfileProcessing}
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
                                        <div className="w-full h-full relative group">
                                            <img
                                                alt={oldProfile.public_id}
                                                className="w-full h-full object-cover rounded-full"
                                                src={oldProfile.url}
                                            />
                                            <button
                                                className={cn(
                                                    "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                                    "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                                    "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                                )}
                                                disabled={isUserProfileProcessing}
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
                                                "border-dashed border-gray-500 flex justify-center items-center bg-purple-400",
                                                "w-full text-white h-full rounded-full cursor-pointer font-medium text-[1.2rem]"
                                            )}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {user?.username[0]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="new-username" className="text-gray-900 font-medium text-[1rem]">Username</label>
                                    <input
                                        className={cn("focus:outline-0 bg-blue-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                                        id="new-username"
                                        name="new-username"
                                        onChange={(event) => setUserName(event.target.value)}
                                        type="text"
                                        value={username}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="new-gender" className="text-gray-900 font-medium text-[1rem]">Gender</label>
                                    <select 
                                        disabled={isUserProfileProcessing}
                                        value={gender}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => setGender(event.target.value)}
                                        className="bg-blue-200 text-gray-900 p-2 outline-none"
                                    >
                                        <option value="">-- Choose Status --</option>
                                        <option value="-">-</option> 
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="new-address" className="text-gray-900 font-medium text-[1rem]">Address</label>
                                    <input
                                        className={cn("focus:outline-0 bg-blue-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                                        id="new-address"
                                        name="new-address"
                                        onChange={(event) => setAddress(event.target.value)}
                                        type="text"
                                        value={address}
                                    />
                                </div>
                                <button
                                    className={cn(
                                        "bg-purple-400 text-white font-medium text-[1rem] p-1.5 cursor-pointer", 
                                        "rounded disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                                    )}
                                    disabled={isUserProfileProcessing || isUserProfileProcessing}
                                    type="submit"
                                >
                                    {isUserProfileProcessing ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            ) : (
                <div className="flex md:w-2/5 w-full flex-col h-full border border-gray-400">
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
                        <div className="bg-white flex flex-col gap-2.5 h-full p-2.5 inset-shadow-sm inset-shadow-gray-400">
                            <div className="flex gap-1.5">
                                <button
                                    className={cn(
                                        "disabled:cursor-not-allowed cursor-pointer", 
                                        "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                    )}
                                    onClick={() => setEditMode(true)}
                                    type="button"
                                >
                                    <Pen size={24}/>
                                </button>
                            </div>
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full">
                                    {user && user.profile_picture !== null && user.profile_picture.public_id !== null ? (
                                        <div className="w-full h-full rounded-full">
                                            <img
                                                alt={user.profile_picture.public_id}
                                                className="w-full h-full object-cover"
                                                src={user.profile_picture.url}
                                            />
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "bg-purple-400 text-white font-medium text-2xl text-[1.2rem]",
                                            "flex justify-center items-center w-full h-full rounded-full"
                                        )}>
                                            {user?.username[0]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[1rem] font-medium text-gray-800">User ID</div>
                                    <div className="text-[1rem] font-medium text-gray-800">
                                        {user && user.user_id ? user.user_id : "-"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                    <div className="text-[1rem] font-medium text-gray-800">
                                        {user && user.username ? user.username : "-"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                    <div className="text-[1rem] font-medium text-gray-800">
                                        {user && user.gender !== null ? user.gender : "-"}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[1rem] font-medium text-gray-800">Address</div>
                                    <div className="text-[1rem] font-medium text-gray-800">
                                        {user && user.address ? user.address : "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div 
                className={cn(
                    "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                    "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                    "border border-gray-400"
                )}
            >
                <div className="flex flex-col gap-2">
                    <div className="text-gray-500 font-medium flex justify-center">
                        <MessageCircle size={34}/>
                    </div>
                    <div className="text-gray-700 font-medium text-center">
                        Welcome to Chit Chat
                    </div>
                </div>
            </div>
        </section>
    );
}