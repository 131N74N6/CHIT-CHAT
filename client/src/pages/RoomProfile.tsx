import Alert from "../components/Alert";
import cn from "../utils/cn";
import useRoomProfileService from "../services/useRoomProfileService";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, Camera, MessageCircle, X } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import useUserProfileService from "../services/useUserProfileService";
import useSocketIo from "../hooks/useSocketIo";
import useRoomMemberService from "../services/useRoomMemberService";
import { useRoomStore } from "../stores/room.store";

export default function RoomProfile() {
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const roomId = useRoomStore((state) => state.roomId);
    const setRoomId = useRoomStore((state) => state.setRoomId);
    
    const { currentUser, isUserProfileProcessing } = useUserProfileService({ setMessage: setMessage });
    const { user } = currentUser;

    const { 
        currentRoomProfile, 
        deleteRoomMt, 
        editMode, 
        setEditMode, 
        changeRoomMt, 
        description,
        fileInputRef, 
        handleImagePreview,
        isRoomProfileProcessing, 
        roomName,
        oldRoomPicture,
        selectedProfileRoom, 
        selectedProfileRoomUrl, 
        setDeleteRoomImage,
        setDescription, 
        setOldRoomPicture,
        setRoomName, 
        setSelectedProfileRoom, 
        setSelectedProfileRoomUrl
    } = useRoomProfileService({ setMessage: setMessage });

    const { detail, errorDetail, isDetailLoading } = currentRoomProfile;

    const { leftRoomMt } = useRoomMemberService({ setMessage: setMessage });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        const savedRoomId = localStorage.getItem("room_id");
        if (savedRoomId && !roomId) setRoomId(savedRoomId);
    }, []); 

    useEffect(() => {
        if (roomId) {
            localStorage.setItem("room_id", roomId);
        } else {
            localStorage.removeItem("room_id");
        }
    }, [roomId]);

    useEffect(() => {
        if (editMode) {
            currentRoomProfile.detail && currentRoomProfile.detail.description ? 
            setDescription(currentRoomProfile.detail.description) :
            setDescription("-");
            currentRoomProfile.detail && currentRoomProfile.detail.profile_picture !== null ? 
            setOldRoomPicture(currentRoomProfile.detail.profile_picture) :
            setOldRoomPicture(null);
        } else {
            setDescription("");
            setOldRoomPicture(null);
        }
    }, [editMode, roomId, currentRoomProfile.detail]);


    useSocketIo({
        identifier: ["room-profile"]
    });

    const isRoomOwner = user && detail && user.user_id === detail.creator_id;

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col relative h-dvh z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={isUserProfileProcessing}/>
            {isDetailLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : errorDetail ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {errorDetail.message}
                    </div>
                </div>
            ) : editMode ? (
                <form 
                    className="flex flex-col h-full p-2.5 gap-3 overflow-y-auto" 
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        changeRoomMt.mutate();
                    }}
                >
                    <input
                        className="hidden"
                        onChange={handleImagePreview}
                        ref={fileInputRef}
                        type="file"
                    />
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full">
                            {selectedProfileRoom && selectedProfileRoomUrl ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={`room-img-${Date.now()}`}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={selectedProfileRoomUrl}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={isUserProfileProcessing || isRoomProfileProcessing}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.stopPropagation();
                                            if (selectedProfileRoomUrl) URL.revokeObjectURL(selectedProfileRoomUrl);
                                            setSelectedProfileRoom(null);
                                            setSelectedProfileRoomUrl(null);
                                        }}
                                        type="button"
                                    >
                                        <X size={1}/>
                                    </button>
                                </div>
                            ) : oldRoomPicture ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={oldRoomPicture.public_id}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={oldRoomPicture.url}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={isUserProfileProcessing || isRoomProfileProcessing}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.stopPropagation();
                                            setDeleteRoomImage(oldRoomPicture);
                                            setOldRoomPicture(null);
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
                                    <Camera size={22}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="room_name" className="text-gray-900 font-medium text-[1rem]">Room name</label>
                        <input
                            className={cn("outline-0 bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full")}
                            id="room_name"
                            name="room_name"
                            onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setRoomName(event.target.value)}
                            type="text"
                            value={roomName}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="room_description" className="text-gray-900 font-medium text-[1rem]">Description</label>
                        <input
                            className={cn(
                                "outline-0 bg-gray-200 text-gray-900 font-medium text-[1rem]", 
                                "p-1.5 w-full max-h-80 overflow-y-auto"
                            )}
                            id="room_description"
                            name="room_description"
                            onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setDescription(event.target.value)}
                            type="text"
                            value={description}
                        />
                    </div>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={isUserProfileProcessing || isRoomProfileProcessing}
                        type="submit"
                    >
                        {isRoomProfileProcessing ? "Saving..." : "Save"}
                    </button>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={isUserProfileProcessing || isRoomProfileProcessing}
                        onClick={() => setEditMode(false)}
                        type="button"
                    >
                        <X size={23}/>
                    </button>
                </form>
            ) : (
                <div className="flex w-full flex-col h-full gap-2.5 p-2.5 md:w-2/5 inset-shadow-sm inset-shadow-gray-400">
                    <div className="bg-white flex flex-col p-2.5 gap-2.5">
                        <div className="flex">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/rooms/chat/${roomId}`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {detail && detail.profile_picture !== null ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={detail.profile_picture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={detail.profile_picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {detail?.name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Created At</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {detail && detail.created_at ? detail.created_at : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Room ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {detail && detail._id ? detail._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {detail && detail.name ? detail.name : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Description</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {detail && detail.description !== null ? detail.description : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {isRoomOwner ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={isUserProfileProcessing}
                                        onClick={() => deleteRoomMt.mutate()}
                                        type="button"
                                    >
                                        Delete room
                                    </button>
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={isUserProfileProcessing}
                                        onClick={() => setEditMode(true)}
                                        type="button"
                                    >
                                        Edit room profile
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={cn(
                                        "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-red-600", 
                                        "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                    )}
                                    disabled={isUserProfileProcessing}
                                    onClick={() => leftRoomMt.mutate()}
                                >
                                    Left room
                                </button>
                            )}
                            <button
                                className={cn(
                                    "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                )}
                                disabled={isUserProfileProcessing}
                                type="button"
                                onClick={() => navigate(`/rooms/member/${roomId}`)}
                            >
                                See Room Member
                            </button>
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