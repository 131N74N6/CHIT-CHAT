import { useNavigate } from "react-router-dom";
import type { UserData } from "./model";
import cn from "../utils/cn";
import { UserMinus2 } from "lucide-react";
import { useUserChatStore } from "../user_chats/store";
import { useUserStore } from "./store";
import { useGroupChatStore } from "../group_chats/store";
import { useGroupMemberStore } from "../group_member/store";
import { useGroupProfileStore } from "../group_profiles/store";

export default function UserData(props: UserData) {
    const navigate = useNavigate();
    const setReceiverId = useUserChatStore((state) => state.setReceiverId);
    
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);
    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);

    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);

    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);

    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);

    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    
    const closeUserChatPopUp = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    const seeUserChatPopUp = () => {
        setReceiverId(props.user._id);
        setShowUserMedia(false);
        setShowUserChatPopUp(true);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    const closeGroupMember = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(true);
    }

    return (
        <div className="bg-gray-50  p-1.5">
            {props.place.name === "group-member" ? (
                <div 
                    className="justify-between items-center flex cursor-pointer"
                    onClick={() => {
                        if (props.isOwnData) {
                            navigate("/profile");
                            closeUserChatPopUp();
                        } else {
                            closeGroupMember();
                            navigate(`/home`);
                        }
                    }}
                >
                    <div className="flex gap-2 items-center">
                        <div className={cn("w-10 h-10 rounded-full")}>
                            {props.user.image && props.user.image_public_id ? (
                                <div className="w-full h-full">
                                    <img 
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.user.image} 
                                        alt={props.user.image_public_id}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-full h-full rounded-full bg-purple-500 text-white", 
                                    "font-medium text-lg flex items-center justify-center"
                                )}>
                                    {props.user.name[0]}
                                </div>
                            )}
                        </div>
                        <div className="text-gray-950 font-medium">{props.user.name}</div>
                    </div>
                    {props.place.isGroupOwner.data ? (
                        <button
                            className={cn(
                                "font-medium text-gray-700 hover:text-gray-400 transition-colors", 
                                "cursor-pointer disabled:cursor-not-allowed"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => {
                                if (props.place.kickMemberMt) props.place.kickMemberMt.mutate(props.user._id);
                            }}
                            type="button"
                        >
                            <UserMinus2 size={22}/>
                        </button>
                    ) : null}
                </div>
            ) : (
                <div 
                    className="flex cursor-pointer items-center gap-1.5"
                    onClick={seeUserChatPopUp}
                >
                    <div className={cn("w-10 h-10 rounded-full")}>
                        {props.user.image && props.user.image_public_id ? (
                            <div className="w-full h-full">
                                <img 
                                    className="w-full h-full object-cover rounded-full" 
                                    src={props.user.image} 
                                    alt={props.user.image_public_id}
                                />
                            </div>
                        ) : (
                            <div className={cn(
                                "w-full h-full rounded-full bg-purple-500 text-white", 
                                "font-medium text-lg flex items-center justify-center"
                            )}>
                                {props.user.name[0]}
                            </div>
                        )}
                    </div>
                    <div className="text-gray-950 font-medium">{props.user.name}</div>
                </div>
            )}
        </div>
    );
}