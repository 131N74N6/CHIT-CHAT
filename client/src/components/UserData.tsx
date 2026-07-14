import { useNavigate } from "react-router-dom";
import type { UserItemIntrf } from "../models/user.model";
import cn from "../utils/cn";

export default function UserData(props: UserItemIntrf) {
    const navigate = useNavigate();

    const windowChat = () => {
        props.setProfilePicture(props.user.profile_picture);
        props.setReceiverId(props.user._id);
        props.setUserName(props.user.username);
    }

    return (
        <>
            <div className={cn("border bg-white border-b-gray-600 md:flex gap-1.5 hidden")} onClick={windowChat}>
                <div className={cn("w-20 h-20 rounded-full")}>
                    {props.user.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
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
            <div className={cn("border bg-white border-b-gray-600 md:hidden flex gap-1.5")} 
                onClick={() => navigate(`/user/chat/${props.user._id}`)}
            >
                <div className={cn("w-20 h-20 rounded-full")}>
                    {props.user.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
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
                <div className="md:hidden block text-gray-950 font-medium">{props.user.username}</div>
            </div>
        </>
    );
}