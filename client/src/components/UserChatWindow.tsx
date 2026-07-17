import { File, SendIcon } from "lucide-react";
import cn from "../utils/cn"
import type { IUserChatWindow } from "../models/user.model";
import ChatList from "./ChatList";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function UserChatWindow(props: IUserChatWindow) {
    const navigate = useNavigate();

    return (
        <div className="h-full flex-col gap-2.5 md:w-2/4 md:flex md:p-2.5 md:flex-col hidden">
            <div className="bg-gray-500 p-2 flex gap-1.5" onClick={props.seeProfile}>
                <div className="w-20 h-20 rounded-full">
                    {props.userProfile.profile_picture !== null ? (
                        <div className="w-full h-full">
                            <img 
                                className="w-full h-full object-cover" 
                                src={props.userProfile.profile_picture.url} 
                                alt={props.userProfile.profile_picture.public_id}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full h-full rounded-full flex items-center", 
                            "justify-center bg-blue-600 text-white font-extralight"
                        )}>
                            {props.userProfile.username[0]}
                        </div>
                    )}
                </div>
                <div className="text-white text-[1.2rem] font-extralight">{props.userProfile.username}</div>
            </div>
            <div className="flex flex-col gap-2.5 p-1">
                {props.isUserChatLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : props.userChatError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.userChatError.message}
                        </div>
                    </div>
                ) : (
                    <ChatList 
                        chats={props.userChats} 
                        currentUserId={props.currentUserId} 
                        fetchNextPage={props.fetchNextUserChat}
                        hasNextPage={props.hasNextUserChat}
                        isFetchingNextPage={props.isFetchingNextUserChats}
                        isProcessing={props.isProcessing}
                        onClearOne={props.onClearOne}
                        onDeleteOne={props.onDeleteOne}
                        onDeleteOnePermanent={props.onDeleteOnePermanent}
                    />
                )}
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 max-h-[30%] overflow-y-auto"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        props.sendChatToUser.mutate();
                    }}
                >
                    <div className="flex justify-end">
                        <input
                            className="inline-0 text-gray-900 font-light w-[90%]"
                            id="message"
                            name="message"
                            type="text"
                        />
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed", 
                                "text-white rounded-full flex justify-center items-center p-1.5",
                                "bg-blue-600 w-[10%] h-[10%] transition-colors hover:bg-blue-500" 
                            )}
                            disabled={props.isProcessing}
                            type="submit"
                        >
                            <SendIcon size={22}/>
                        </button>
                    </div>
                    <div>
                        <button 
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed", 
                                "border border-gray-500 bg-white text-gray-500 w-[20%] p-1.5"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => navigate(`/media/preview`)}
                            type="button"
                        >
                            <File size={22}/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}