import { ArrowBigLeft } from "lucide-react";
import type { IUserProfileWindow } from "../models/user.model";
import cn from "../utils/cn";
import Loading from "./Loading";

export default function UserProfileWindow(props: IUserProfileWindow) {
    return (
        <div className="flex w-full flex-col h-full bg-gray-400 gap-2.5 p-1.5">
            {props.isProfileLoading ? (
                <div className="flex justify-center items-center h-full">
                    <Loading/>
                </div>
            ) : props.errorProfile ? (
                <div className="flex justify-center items-center h-full">
                    <div className="text-center font-medium text-4xl text-gray-800">
                        {props.errorProfile.message}
                    </div>
                </div>
            ) : (
                <div className="bg-white flex flex-col p-2.5 gap-2.5">
                    <div className="flex">
                        <button
                            className={cn(
                                "disabled:cursor-not-allowed cursor-pointer", 
                                "hover:text-gray-500 transition-colors text-gray-800 font-medium"
                            )}
                            onClick={props.seeUserChat}
                            type="button"
                        >
                            <ArrowBigLeft size={24}/>
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full">
                            {props.userProfile && props.userProfile.profile_picture !== null ? (
                                <div className="w-full h-full rounded-full">
                                    <img
                                        alt={props.userProfile.profile_picture.public_id}
                                        className="w-full h-full object-cover"
                                        src={props.userProfile.profile_picture.url}
                                    />
                                </div>
                            ) : (
                                <div className={cn(
                                    "bg-blue-600 text-white font-medium text-2xl",
                                    "flex justify-center items-center w-full h-full rounded-full"
                                )}>
                                    {props.userProfile.username[0]}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Created At</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.userProfile.created_at || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Address</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.userProfile.address || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">User ID</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.userProfile._id || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Username</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.userProfile.username || "-"}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <div className="text-xl font-medium text-gray-800">Gender</div>
                            <div className="text-xl font-medium text-gray-800">
                                {props.userProfile.gender || "-"}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}