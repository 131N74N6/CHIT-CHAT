import { useNavigate } from "react-router-dom";
import type { RoomItemIntrf } from "../models/room.model";
import cn from "../utils/cn";

export default function RoomItem(props: RoomItemIntrf) {
    const navigate = useNavigate();
    
    return (
        <div className="border-b bg-white border-gray-600">
            <div 
                className="p-1.5 items-center cursor-pointer md:flex gap-1.5 hidden"
                onClick={() => props.setRoomId(props.room._id)}
            >
                <div className="w-10 h-10 rounded-full">
                    {props.room.profile_picture && props.room.profile_picture.public_id ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.room.profile_picture.url} 
                                alt={props.room.profile_picture.public_id}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-purple-500 text-white font-medium text-lg flex items-center justify-center">
                            {props.room.name[0]}
                        </div>
                    )}
                </div>
                <div className="text-gray-950 font-medium">{props.room.name}</div>
            </div>
            <div 
                className="p-1.5 items-center cursor-pointer md:hidden flex gap-1.5" 
                onClick={() => {
                    props.setRoomId(props.room._id);
                    navigate(`/rooms/chat/${props.room._id}`);
                    localStorage.setItem("room id", props.room._id);
                }}
            >
                <div className="w-10 h-10 rounded-full">
                    {props.room.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.room.profile_picture.url} 
                                alt={props.room.profile_picture.public_id}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full h-full rounded-full bg-purple-500 text-white", 
                            "font-medium text-lg flex items-center justify-center"
                        )}>
                            {props.room.name[0]}
                        </div>
                    )}
                </div>
                <div className="md:hidden block text-gray-950 font-medium">{props.room.name}</div>
            </div>
        </div>
    );
}