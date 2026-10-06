import { useNavigate } from "react-router-dom";
import type { IGroupProfileData } from "./model";
import { useGroupChatStore } from "../group_chats/store";
import cn from "../utils/cn";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "./store";

export default function GroupData(props: IGroupProfileData) {
    const navigate = useNavigate();
    const setFilesPopUp = useGroupChatStore((state) => state.setFilesPopUp);

    const setGroupId = useGroupChatStore((state) => state.setGroupId);
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);

    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);
    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const seeGroupChat = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setGroupId(props.group._id);
        setFilesPopUp(true);
    }

    return (
        <div className="border-b bg-white border-gray-600">
            <div 
                className="p-1.5 items-center cursor-pointer md:flex gap-1.5 hidden"
                onClick={seeGroupChat}
            >
                <div className="w-10 h-10 rounded-full">
                    {props.group.group_profile.public_id !== "" ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.group.group_profile.url} 
                                alt={props.group.group_profile.public_id}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-purple-500 text-white font-medium text-lg flex items-center justify-center">
                            {props.group.group_name[0]}
                        </div>
                    )}
                </div>
                <div className="text-gray-950 font-medium">{props.group.group_name}</div>
            </div>
            <div 
                className="p-1.5 items-center cursor-pointer md:hidden flex gap-1.5" 
                onClick={() => {
                    setGroupId(props.group._id);
                    navigate(`/rooms/chat/${props.group._id}`);
                    localStorage.setItem("room id", props.group._id);
                }}
            >
                <div className="w-10 h-10 rounded-full">
                    {props.group.group_profile.public_id !== "" ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.group.group_profile.url} 
                                alt={props.group.group_profile.public_id}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full h-full rounded-full bg-purple-500 text-white", 
                            "font-medium text-lg flex items-center justify-center"
                        )}>
                            {props.group.group_name[0]}
                        </div>
                    )}
                </div>
                <div className="md:hidden block text-gray-950 font-medium">{props.group.group_name}</div>
            </div>
        </div>
    );
}