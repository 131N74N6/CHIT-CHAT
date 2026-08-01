import { useNavigate } from "react-router-dom";
import type { UserItemIntrf } from "../models/user.model";
import cn from "../utils/cn";
import { UserMinus2 } from "lucide-react";

export default function UserData(props: UserItemIntrf) {
    const navigate = useNavigate();

    return (
        <div className="border-b border-gray-600 p-1.5">
            {props.place.name === "room-member" ? (
                <div 
                    className="bg-white justify-between items-center flex cursor-pointer"
                    onClick={() => {
                        if (props.place.isOwnData && !props.place.isOwnData.isLoading && props.place.isOwnData.data) {
                            navigate("/profile");
                        } else {
                            props.setReceiverId(props.user._id);
                            navigate(`/user/chat/${props.user._id}`);
                        }
                    }}
                >
                    <div className="flex gap-2 items-center">
                        <div className={cn("w-10 h-10 rounded-full")}>
                            {props.user.profile_picture && props.user.profile_picture.public_id ? (
                                <div className="w-full h-full">
                                    <img 
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.user.profile_picture.url} 
                                        alt={props.user.profile_picture.public_id}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-full h-full rounded-full bg-purple-500 text-white", 
                                    "font-medium text-lg flex items-center justify-center"
                                )}>
                                    {props.user.username[0]}
                                </div>
                            )}
                        </div>
                        <div className="text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                    {!props.place.isRoomOwner.isLoading && props.place.isRoomOwner.data ? (
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
                <div className="bg-white items-center cursor-pointer">
                    <div 
                        className="md:flex gap-1.5 hidden"
                        onClick={() => props.setReceiverId(props.user._id)}
                    >
                        <div className={cn("w-10 h-10 rounded-full")}>
                            {props.user.profile_picture && props.user.profile_picture.public_id ? (
                                <div className="w-full h-full">
                                    <img 
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.user.profile_picture.url} 
                                        alt={props.user.profile_picture.public_id}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-full h-full rounded-full bg-purple-500 text-white", 
                                    "font-medium text-lg flex items-center justify-center"
                                )}>
                                    {props.user.username[0]}
                                </div>
                            )}
                        </div>
                        <div className="text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                    <div 
                        className="md:hidden flex items-center gap-1.5" 
                        onClick={() => {
                            props.setReceiverId(props.user._id);
                            navigate(`/user/chat/${props.user._id}`);
                        }}
                    >
                        <div className="w-10 h-10 rounded-full">
                            {props.user.profile_picture !== null && props.user.profile_picture.public_id !== null ? (
                                <div className="w-full h-full">
                                    <img 
                                        className="w-full h-full object-cover rounded-full" 
                                        src={props.user.profile_picture.url} 
                                        alt={props.user.profile_picture.public_id}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "w-full h-full rounded-full bg-purple-500 text-white", 
                                    "font-medium text-lg flex items-center justify-center"
                                )}>
                                    {props.user.username[0]}
                                </div>
                            )}
                        </div>
                        <div className="text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                </div>
            )}
        </div>
    );
}