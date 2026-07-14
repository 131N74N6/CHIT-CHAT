import cn from "../utils/cn";

export default function RoomProfileWindow() {
    return (
        <div className="flex flex-col gap-2.5">
            <div className="w-40 h-40 rounded-full">
                <div className="w-full h-full">
                    <img 
                        className="w-full h-full object-cover" 
                        src={"props.profilePicture.url"} 
                        alt={"props.profilePicture.public_id"}
                    />
                </div>
                <div className={cn(
                    "w-full h-full rounded-full flex items-center", 
                    "justify-center bg-blue-600 text-white font-extralight"
                )}>
                    {"props.username[0]"}
                </div>
            </div>
            <div className="">
                Description
            </div>
            <div className="">
                Member
            </div>
        </div>
    );
}