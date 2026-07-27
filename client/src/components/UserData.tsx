import { useNavigate } from "react-router-dom";
import type { UserItemIntrf } from "../models/user.model";
import cn from "../utils/cn";

export default function UserData(props: UserItemIntrf) {
    const navigate = useNavigate();

    return (
        <>
            {props.isInRoom ? (
                props.own ? (
                    <div 
                        className={cn(
                            "border-b bg-white border-b-gray-600 p-1.5 flex items-center gap-1.5 md:hidden"
                        )} 
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
                        <div className="md:hidden block text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                ) : (
                    <div 
                        className={cn(
                            "border-b bg-white border-b-gray-600 p-1.5 cursor-pointer flex items-center gap-1.5 md:hidden"
                        )} 
                        onClick={() => {
                            props.setReceiverId(props.user._id);
                            navigate(`/user/chat/${props.user._id}`);
                        }}
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
                        <div className="md:hidden block text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                )
                
            ) : (
                <>
                    <div 
                        className="border-b bg-white border-b-gray-600 p-1.5 items-center cursor-pointer md:flex gap-1.5 hidden"
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
                        className={cn(
                            "border-b bg-white border-b-gray-600 p-1.5 cursor-pointer md:hidden flex items-center gap-1.5"
                        )} 
                        onClick={() => {
                            props.setReceiverId(props.user._id);
                            navigate(`/user/chat/${props.user._id}`);
                        }}
                        >
                        <div className="w-10 h-10 rounded-full">
                            {props.user.profile_picture !== null ? (
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
                        <div className="md:hidden block text-gray-950 font-medium">{props.user.username}</div>
                    </div>
                </>
            )}
        </>
    );
}