import cn from "../utils/cn";
import { Camera, MessageCircle, UserCircle, X } from "lucide-react";
import Loading from "../components/Loading";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupProfileStore } from "./store";
import type { IGroupProfileDetailPopUp } from "./model";
import { useGroupMemberStore } from "../group_member/store";

export default function GroupDetailPopUp(props: IGroupProfileDetailPopUp) {
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);

    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);
    
    const editMode = useGroupProfileStore((state) => state.editMode);
    const setEditMode = useGroupProfileStore((state) => state.setEditMode);
    
    const groupDescription = useGroupProfileStore((state) => state.groupDescription);
    const setGroupDescription = useGroupProfileStore((state) => state.setGroupDescription);
    
    const groupName = useGroupProfileStore((state) => state.groupName);
    const setGroupName = useGroupProfileStore((state) => state.setGroupName);

    const selectedProfileGroup = useGroupProfileStore((state) => state.selectedProfileGroup);
    const setSelectedProfileGroup = useGroupProfileStore((state) => state.setSelectedProfileGroup);

    const selectedProfileGroupUrl = useGroupProfileStore((state) => state.selectedProfileGroupUrl);
    const setSelectedProfileGroupUrl = useGroupProfileStore((state) => state.setSelectedProfileGroupUrl);

    const oldGroupProfilePicture = useGroupProfileStore((state) => state.oldGroupProfilePicture);

    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const seeGroupChat = () => {
        setShowGroupChatPopUp(true);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    const seeGroupMember = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(true);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5 border border-gray-400">
            {props.groupProfile.isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : props.groupProfile.error ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {props.groupProfile.error.message}
                    </div>
                </div>
            ) : editMode ? (
                <form 
                    className="flex flex-col h-full p-2.5 gap-3 overflow-y-auto" 
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        props.groupProfile.changeGroupMt.mutate();
                    }}
                >
                    <input
                        className="hidden"
                        onChange={props.groupProfile.handleImagePreview}
                        ref={props.groupProfile.fileInputRef}
                        type="file"
                    />
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full">
                            {selectedProfileGroup && selectedProfileGroupUrl ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={`room-img-${Date.now()}`}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={selectedProfileGroupUrl}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={props.isProcessing}
                                        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.stopPropagation();
                                            if (selectedProfileGroupUrl) URL.revokeObjectURL(selectedProfileGroupUrl);
                                            setSelectedProfileGroup(null);
                                            setSelectedProfileGroupUrl(null);
                                        }}
                                        type="button"
                                    >
                                        <X size={1}/>
                                    </button>
                                </div>
                            ) : oldGroupProfilePicture.public_id !== "" ? (
                                <div className="w-full h-full relative group">
                                    <img
                                        alt={oldGroupProfilePicture.public_id}
                                        className="w-full h-full object-cover rounded-full" 
                                        src={oldGroupProfilePicture.url}
                                    />
                                    <button
                                        className={cn(
                                            "font-medium w-8 h-8 rounded-full bg-red-600 text-white opacity-0 cursor-pointer",
                                            "disabled:cursor-not-allowed group-hover:opacity-100 duration-300 transition-opacity",
                                            "flex justify-center items-center p-1.5 absolute top-1 left-[46%]"
                                        )}
                                        disabled={props.isProcessing}
                                        onClick={() => props.groupProfile.deleteGroupProfilePictureMt.mutate()}
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
                                    onClick={() => props.groupProfile.fileInputRef.current?.click()}
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
                            onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setGroupName(event.target.value)}
                            type="text"
                            value={groupName}
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
                            onChange={(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setGroupDescription(event.target.value)}
                            type="text"
                            value={groupDescription}
                        />
                    </div>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={props.isProcessing}
                        type="submit"
                    >
                        {props.isProcessing ? "Saving..." : "Save"}
                    </button>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={props.isProcessing}
                        onClick={() => setEditMode(false)}
                        type="button"
                    >
                        <X size={23}/>
                    </button>
                </form>
            ) : (
                <main className="flex w-full flex-col h-full gap-2.5 p-2.5 md:w-2/5 inset-shadow-sm inset-shadow-gray-400">
                    <div className="bg-white flex flex-col p-2.5 gap-2.5">
                        <div className="flex gap-2">
                            <button
                                className={cn(
                                    "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                )}
                                disabled={props.isProcessing}
                                type="button"
                                onClick={seeGroupMember}
                            >
                                <UserCircle size={16}/>
                            </button>
                            <button
                                className={cn(
                                    "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                )}
                                disabled={props.isProcessing}
                                type="button"
                                onClick={seeGroupChat}
                            >
                                <MessageCircle size={16}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {props.groupProfile && 
                                props.groupProfile.picture.public_id !== "" ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={props.groupProfile.picture.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={props.groupProfile.picture.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {props.groupProfile?.group_name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Created At</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {new Date(props.groupProfile.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Room ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.groupProfile._id}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.groupProfile.group_name}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Description</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {props.groupProfile.description}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {props.groupProfile.isGroupOwner ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={props.isProcessing}
                                        onClick={() => props.groupProfile.deleteGroupMt.mutate()}
                                        type="button"
                                    >
                                        Delete room
                                    </button>
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={props.isProcessing}
                                        onClick={() => setEditMode(true)}
                                        type="button"
                                    >
                                        Edit group profile
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={cn(
                                        "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-red-600", 
                                        "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                    )}
                                    disabled={props.isProcessing}
                                    onClick={() => props.groupMember.leftGroupMt.mutate()}
                                >
                                    Left group
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            )}
        </section>
    );
}