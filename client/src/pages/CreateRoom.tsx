import { Camera, X } from "lucide-react";
import Navbar from "../components/Navbar";
import UserServices from "../services/user.service";
import cn from "../utils/cn";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import Alert from "../components/Alert";
import createRoomService from "../services/create_room.service";

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

    const { currentUser, isUserProcessing } = UserServices();

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
    } = createRoomService({ 
        currentUserId: currentUser.user?.user_id,
        setMessage: setMessage 
    });

    return (
        <section className="flex flex-col h-screen relative z-10">
            <Navbar isProcessing={isUserProcessing}/>
            {message ? <Alert message={message}/> : null}
            <form 
                className="flex flex-col h-full p-2.5 gap-3 overflow-y-auto" 
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
                    <div className="w-40 h-40 rounded-full">
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
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="room_name" className="text-gray-900 font-medium text-[1.2rem]">Room name</label>
                    <input
                        className={cn("inline-0 bg-gray-400 text-gray-900 font-medium p-1.5 text-[1.2rem]")}
                        id="room_name"
                        name="room_name"
                        onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setRoomName(event.target.value)}
                        type="text"
                        value={roomName}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="room_description" className="text-gray-900 font-medium text-[1.2rem]">Room name</label>
                    <input
                        className={cn(
                            "inline-0 bg-gray-400 text-gray-900 font-medium text-[1.2rem]", 
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
                        "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1.2rem]",
                        "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                    )}
                    disabled={isUserProcessing || isMakeRoomProcessing}
                    type="submit"
                >
                    Create room
                </button>
            </form>
        </section>
    );
}