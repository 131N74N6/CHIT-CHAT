import { useNavigate } from "react-router-dom";
import type { UserItemIntrf } from "../models/user.model";
import cn from "../utils/cn";

export default function UserData(props: UserItemIntrf) {
    const navigate = useNavigate();

    const showWindowChat = () => {
        props.setReceiverId!(props.user.user_id);
    }

    return (
        <>
            <div 
                className={cn(
                    "md:border-b md:bg-white md:border-b-gray-600 p-1.5 md:items-center md:cursor-pointer md:flex md:gap-1.5 hidden"
                )} 
                onClick={showWindowChat}>
                <div className={cn("w-10 h-10 rounded-full")}>
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
            <div 
                className={cn(
                    "border-b bg-white border-b-gray-600 p-1.5 cursor-pointer md:hidden flex items-center gap-1.5"
                )} 
                onClick={() => navigate(`/user/chat/${props.user.user_id}`)}
            >
                <div className={cn("w-10 h-10 rounded-full")}>
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