import { useNavigate } from "react-router-dom";
import type { RoomItemIntrf } from "../models/room.model";

export default function RoomItem(props: RoomItemIntrf) {
    const navigate = useNavigate();

    const showWindowChat = () => {
        props.setRoomId(props.room._id);
        props.setRoomName(props.room.name);
        props.setRoomProfilePicture(props.room.profile_picture);
    }
    
    return (
        <>
            <div className="border bg-white border-b-gray-600 md:flex gap-1.5 hidden" onClick={showWindowChat}>
                <div className="w-20 h-20 rounded-full">
                    {props.room.profile_picture !== null ? (
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
            <div className="border bg-white border-b-gray-600 md:hidden flex gap-1.5" onClick={() => navigate(`/room/chat/${props.room._id}`)}>
                <div className="w-20 h-20 rounded-full">
                    {props.room.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.room.profile_picture.url} 
                                alt={props.room.profile_picture.public_id}/>
                        </div>
                    ) : (
                        <div className="w-full h-full rounded-full bg-purple-500 text-white font-medium text-lg flex items-center justify-center">
                            {props.room.name[0]}
                        </div>
                    )}
                </div>
                <div className="md:hidden block text-gray-950 font-medium">{props.room.name}</div>
            </div>
        </>
    );
}