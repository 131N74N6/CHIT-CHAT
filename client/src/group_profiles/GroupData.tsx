import type { IGroupProfileData } from "./model";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "./store";

export default function GroupData(props: IGroupProfileData) {
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);
    const setGroupId = useGroupChatStore((state) => state.setGroupId);
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);

    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);
    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const seeGroupChat = () => {
        setGroupId(props.group._id);
        setShowGroupChatPopUp(true);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    return (
        <div className="border-b border-gray-600">
            <div 
                className="p-1.5 items-center cursor-pointer flex gap-1.5"
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
        </div>
    );
}