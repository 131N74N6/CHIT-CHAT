import { Camera, MessageCircle, X } from "lucide-react";
import Navbar from "../components/Navbar";
import useUserServices from "../services/useUserService";
import cn from "../utils/cn";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import useCreateRoomService from "../services/useCreateRoomService";

export default function CreateRoom() {
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

    const { currentUser, isUserProcessing } = useUserServices();

    const { 
        description,
        fileInputRef, 
        handleImagePreview,
        isMakeRoomProcessing, 
        makeRoomMt, 
        roomName,
        selectedProfileRoom, 
        selectedProfileRoomUrl, 
        setDescription, 
        setRoomName, 
        setSelectedProfileRoom, 
        setSelectedProfileRoomUrl 
    } = useCreateRoomService({ 
        currentUserId: currentUser.user?.user_id,
        setMessage: setMessage 
    });

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col h-screen relative z-10">
            <Navbar isProcessing={isUserProcessing}/>
            {message ? <Alert message={message}/> : null}
            <form 
                className={cn(
                    "w-full md:w-2/5 flex flex-col h-full p-2.5 gap-3 overflow-y-auto", 
                    "inset-shadow-sm inset-shadow-gray-400 border border-gray-400"
                )} 
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    makeRoomMt.mutate();
                }}
            >
                <input
                    className="hidden"
                    onChange={handleImagePreview}
                    ref={fileInputRef}
                    type="file"
                />
                <div className="flex justify-center">
                    <div className="w-30 h-30 rounded-full">
                        {selectedProfileRoom ? (
                            <div className="w-full h-full relative group">
                                <img
                                    alt={`room-img-${Date.now()}`}
                                    className="w-full h-full object-cover" 
                                    src={selectedProfileRoomUrl!}
                                />
                                <button
                                    className={cn(
                                        "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                        "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                        "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                    )}
                                    disabled={isUserProcessing || isMakeRoomProcessing}
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
                        ) : (
                            <div 
                                className={cn(
                                    "flex justify-center items-center bg-blue-300 text-white",
                                    "w-full h-full rounded-full cursor-pointer font-medium"
                                )}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera size={30}/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="room_name" className="text-gray-900 font-medium text-[1.2rem]">Name</label>
                    <input
                        className={cn("focus:outline-0 w-full bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem]")}
                        id="room_name"
                        name="room_name"
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setRoomName(event.target.value)}
                        type="text"
                        value={roomName}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="room_description" className="text-gray-900 font-medium text-[1.2rem]">Description</label>
                    <input
                        className={cn(
                            "focus:outline-0 bg-gray-200 text-gray-900 font-medium text-[1rem]", 
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
                    disabled={isUserProcessing || isMakeRoomProcessing}
                    type="submit"
                >
                    Create room
                </button>
            </form>
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