import Alert from "../components/Alert";
import cn from "../utils/cn";
import Navbar from "../components/Navbar";
import { ArrowBigLeft, Camera, MessageCircle, X } from "lucide-react";
import { useMessageStore } from "../stores/message.store";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useGroupProfileService from "./service";
import useGroupMemberService from "../group_member/service";
import { useUserStore } from "../user_profiles/store";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupProfileStore } from "./store";

export default function GroupDetail() {
    const { room_id } = useParams();
    const navigate = useNavigate();

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const groupId = useGroupChatStore((state) => state.groupId);
    const setGroupId = useGroupChatStore((state) => state.setGroupId);
    
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
    const setOldGroupProfilePicture = useGroupProfileStore((state) => state.setOldGroupProfilePicture);

    const groupMember = useGroupMemberService();
    const groupProfile = useGroupProfileService();

    const currentUserId = useUserStore((state) => state.currentUserId);

    useEffect(() => {
        if (room_id) setGroupId(room_id);
    }, [room_id, setGroupId]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (editMode) {
            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_name !== "-" ? 
            setGroupName(groupProfile.showGroupDetail.data.group_name) : 
            setGroupName("-");

            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_description !== "-" ? 
            setGroupDescription(groupProfile.showGroupDetail.data.group_description) :
            setGroupDescription("-");

            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_profile.public_id !== "" ? 
            setOldGroupProfilePicture(groupProfile.showGroupDetail.data.group_profile) :
            setOldGroupProfilePicture({
                file_name: "",
                file_type: "",
                public_id: "",
                resource_type: "",
                size: 0,
                url: "",
            });
        } else {
            setGroupDescription("-");
            setGroupName("-");
            setSelectedProfileGroup(null);
            setSelectedProfileGroupUrl("");
        }
    }, [editMode, groupId, groupProfile.showGroupDetail.data]);

    const isGroupOwner = currentUserId === groupProfile.showGroupDetail.data?.owner_id;

    return (
        <section className="flex md:flex-row p-2.5 gap-2.5 flex-col relative h-dvh z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={groupProfile.isProcessing || groupMember.isProcessing}/>
            {groupProfile.showGroupDetail.isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : groupProfile.showGroupDetail.error ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {groupProfile.showGroupDetail.error.message}
                    </div>
                </div>
            ) : editMode ? (
                <form 
                    className="flex flex-col h-full p-2.5 gap-3 overflow-y-auto" 
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        groupProfile.changeGroupMt.mutate();
                    }}
                >
                    <input
                        className="hidden"
                        onChange={groupProfile.handleImagePreview}
                        ref={groupProfile.fileInputRef}
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
                                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
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
                                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
                                        onClick={() => groupProfile.deleteGroupProfilePictureMt.mutate()}
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
                                    onClick={() => groupProfile.fileInputRef.current?.click()}
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
                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
                        type="submit"
                    >
                        {groupProfile.isProcessing ? "Saving..." : "Save"}
                    </button>
                    <button
                        className={cn(
                            "bg-blue-600 text-white font-medium cursor-pointer p-1.5 text-[1rem]",
                            "hover:bg-blue-800 transition-colors disabled:cursor-not-allowed"
                        )}
                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
                        onClick={() => setEditMode(false)}
                        type="button"
                    >
                        <X size={23}/>
                    </button>
                </form>
            ) : (
                <main className="flex w-full flex-col h-full gap-2.5 p-2.5 md:w-2/5 inset-shadow-sm inset-shadow-gray-400">
                    <div className="bg-white flex flex-col p-2.5 gap-2.5">
                        <div className="flex">
                            <button
                                className={cn(
                                    "disabled:cursor-not-allowed cursor-pointer", 
                                    "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                                )}
                                onClick={() => navigate(`/rooms/chat/${groupId}`)}
                                type="button"
                            >
                                <ArrowBigLeft size={24}/>
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full">
                                {groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.public_id !== "" ? (
                                    <div className="w-full h-full rounded-full">
                                        <img
                                            alt={groupProfile.showGroupDetail.data.group_profile.public_id}
                                            className="w-full h-full object-cover rounded-full"
                                            src={groupProfile.showGroupDetail.data.group_profile.url}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "bg-blue-600 text-white font-medium text-2xl",
                                        "flex justify-center items-center w-full h-full rounded-full"
                                    )}>
                                        {groupProfile.showGroupDetail.data?.group_name[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Created At</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {
                                        groupProfile.showGroupDetail.data && 
                                        groupProfile.showGroupDetail.data.created_at ? 
                                        new Date(groupProfile.showGroupDetail.data?.created_at).toLocaleString() : "-"
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Room ID</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data._id ? groupProfile.showGroupDetail.data._id : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Username</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_name ? groupProfile.showGroupDetail.data.group_name : "-"}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[1rem] font-medium text-gray-800">Description</div>
                                <div className="text-[1rem] font-medium text-gray-800">
                                    {groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_description !== null ? groupProfile.showGroupDetail.data.group_description : "-"}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            {isGroupOwner ? (
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
                                        onClick={() => groupProfile.deleteGroupMt.mutate()}
                                        type="button"
                                    >
                                        Delete room
                                    </button>
                                    <button
                                        className={cn(
                                            "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-amber-600", 
                                            "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                        )}
                                        disabled={groupProfile.isProcessing || groupMember.isProcessing}
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
                                    disabled={groupProfile.isProcessing || groupMember.isProcessing}
                                    onClick={() => groupMember.leftGroupMt.mutate()}
                                >
                                    Left group
                                </button>
                            )}
                            <button
                                className={cn(
                                    "bg-gray-200 cursor-pointer disabled:cursor-not-allowed text-olive-600", 
                                    "text-[0.8rem] hover:bg-gray-500 hover:text-white transition-colors font-medium p-1.5"
                                )}
                                disabled={groupProfile.isProcessing || groupMember.isProcessing}
                                type="button"
                                onClick={() => navigate(`/rooms/member/${groupId}`)}
                            >
                                See Room Member
                            </button>
                        </div>
                    </div>
                </main>
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