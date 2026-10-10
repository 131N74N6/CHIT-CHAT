import { useEffect } from "react";
import useUserProfileService from "../user_profiles/service";
import { useMessageStore } from "../stores/message.store";
import Loading from "../loading/Loading";
import Navbar from "../navbar/Navbar";
import { ArrowBigLeft, MessageCircle, Pen, X } from "lucide-react";
import Alert from "../components/Alert";
import cn from "../utils/cn";
import useAuthService from "./service";
import { useUserStore } from "../user_profiles/store";

export default function YourProfile() {
    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const editMode = useUserStore((state) => state.editMode);
    const setEditMode = useUserStore((state) => state.setEditMode);
    
    const address = useUserStore((state) => state.address);
    const setAddress = useUserStore((state) => state.setAddress);

    const description = useUserStore((state) => state.description);
    const setDescription = useUserStore((state) => state.setDescription);

    const gender = useUserStore((state) => state.gender);
    const setGender = useUserStore((state) => state.setGender);

    const profilePicture = useUserStore((state) => state.profilePicture);
    const setProfilePicture = useUserStore((state) => state.setProfilePicture);

    const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
    const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);

    const oldProfilePicture = useUserStore((state) => state.oldProfilePicture);

    const username = useUserStore((state) => state.username);
    const setUserName = useUserStore((state) => state.setUserName);
    
    const owner = useAuthService();
    const userProfile = useUserProfileService();
    
    useEffect(() => {
        if (editMode && userProfile.showOtherUser.data) {
            setAddress(userProfile.showOtherUser.data.address || "-")
            setDescription(userProfile.showOtherUser.data.description || "-");
            setGender(userProfile.showOtherUser.data.gender || "-");
            setUserName(userProfile.showOtherUser.data.name || "-");
        } else {
            setAddress("");
            setDescription("");
            setGender("");
            setUserName("");
        }
    }, [editMode]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    return (
        <section className="flex md:flex-row gap-2.5 p-2.5 flex-col relative h-dvh z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={owner.isProcessing || userProfile.isProcessing}/>
            {owner.getCurrentUser.isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : owner.getCurrentUser.error ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {owner.getCurrentUser.error.message}
                    </div>
                </div>
            ) : editMode ? (
                <form 
                    className="flex w-full md:w-2/5 flex-col h-full p-2.5 inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        userProfile.changeUserMt.mutate();
                    }}
                >                
                    <div className="bg-white flex flex-col gap-2.5">
                        <input
                            className="hidden"
                            onChange={userProfile.handleImagePreview}
                            ref={userProfile.fileInputRef}
                            type="file"
                        />
                        <div className="flex gap-1.5">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                disabled={owner.isProcessing || userProfile.isProcessing}
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
                                            disabled={owner.isProcessing || userProfile.isProcessing}
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
                                ) : oldProfilePicture && oldProfilePicture.public_id !== "-" ? (
                                    <div className="w-full h-full relative group">
                                        <img
                                            alt={oldProfilePicture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={oldProfilePicture.url}
                                        />
                                        <button
                                            className={cn(
                                                "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                                "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                                "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                            )}
                                            disabled={owner.isProcessing || userProfile.isProcessing}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                                event.stopPropagation();
                                                userProfile.deleteUserProfilePictureMt.mutate();
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
                                        onClick={() => userProfile.fileInputRef.current?.click()}
                                    >
                                        {owner.getCurrentUser.data?.user_name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-username" className="text-gray-900 font-medium text-[1rem]">Username</label>
                                <input
                                    className={cn("outline-0 bg-blue-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                                    id="new-username"
                                    name="new-username"
                                    onChange={(event) => setUserName(event.target.value)}
                                    type="text"
                                    value={username}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-description" className="text-gray-900 font-medium text-[1rem]">Username</label>
                                <textarea
                                    className={cn("outline-0 resize-none bg-blue-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                                    id="new-description"
                                    name="new-description"
                                    onChange={(event) => setDescription(event.target.value)}
                                    value={description}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="new-gender" className="text-gray-900 font-medium text-[1rem]">Gender</label>
                                <select 
                                    disabled={owner.isProcessing || userProfile.isProcessing}
                                    value={gender}
                                    onChange={(event) => setGender(event.target.value)}
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
                                    className={cn("outline-0 bg-blue-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
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
                                disabled={owner.isProcessing || userProfile.isProcessing}
                                type="submit"
                            >
                                {userProfile.isProcessing ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="flex md:w-2/5 w-full flex-col h-full border border-gray-400">
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
                                {owner.getCurrentUser.data && 
                                owner.getCurrentUser.data.profile_picture.public_id !== null && 
                                owner.getCurrentUser.data.profile_picture.url !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={owner.getCurrentUser.data.profile_picture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={owner.getCurrentUser.data.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-purple-400 text-white font-medium text-2xl text-[1.2rem]",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {owner.getCurrentUser.data?.user_name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">User ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {owner.getCurrentUser.data ? owner.getCurrentUser.data.user_id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {owner.getCurrentUser.data ? owner.getCurrentUser.data.user_name : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {owner.getCurrentUser.data ? owner.getCurrentUser.data.gender : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Gender</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {owner.getCurrentUser.data ? owner.getCurrentUser.data.description : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Address</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {owner.getCurrentUser.data ? owner.getCurrentUser.data.address : "-"}
                                </div>
                            </div>
                        </div>
                    </div>
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