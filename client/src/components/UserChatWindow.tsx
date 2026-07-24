import { File, Menu, MenuSquare, SendIcon, X } from "lucide-react";
import cn from "../utils/cn"
import type { IUserChatWindow } from "../models/user.model";
import ChatList from "./ChatList";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function UserChatWindow(props: IUserChatWindow) {
    const navigate = useNavigate();
    
    return (
        <div className="h-full flex-col md:flex md:flex-col hidden">
                {props.isSelectMode ? (
                    <div className="bg-gray-400 p-2 flex gap-1.5 cursor-pointer justify-end">
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => {
                                props.clearSelection();
                                props.setIsSelectMode(false);
                            }}
                            type="button"
                        >
                            <X size={23}/>
                        </button>
                        <button
                            className={cn(
                                "font-medium text-gray-600 cursor-pointer", 
                                "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.setShowDeleteOption2(true)}
                            type="button"
                        >
                            <Menu size={23}/>
                        </button>
                    </div>
                ) : (
                    <div className="bg-gray-200 p-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 cursor-pointer rounded-full" onClick={() => navigate(`/user/profile/${props.receiverId}`)}>
                                {props.userProfile && props.userProfile.profile_picture !== null ? (
                                    <div className="w-full h-full">
                                        <img 
                                            className="w-full h-full object-cover" 
                                            src={props.userProfile.profile_picture.url} 
                                            alt={props.userProfile.profile_picture.public_id}
                                        />
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "w-full h-full rounded-full flex items-center text-[0.9rem]", 
                                        "justify-center bg-purple-500 text-white font-medium"
                                    )}>
                                        {props.userProfile?.username[0]}
                                    </div>
                                )}
                            </div>
                            <div className="text-gray-900 text-[1.2rem] font-medium">{props.userProfile?.username}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                className={cn(
                                    "font-medium text-gray-600 cursor-pointer", 
                                    "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                                )}
                                disabled={props.isProcessing}
                                onClick={() => props.setReceiverId("")}
                                type="button"
                            >
                                <X size={23}/>
                            </button>
                            <button
                                className={cn(
                                    "font-medium text-gray-600 cursor-pointer", 
                                    "disabled:cursor-not-allowed hover:text-gray-400 transition-colors"
                                )}
                                disabled={props.isProcessing}
                                onClick={() => props.setShowDeleteOption1(true)}
                                type="button"
                            >
                                <MenuSquare size={23}/>
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex flex-col gap-2.5 px-2.5 h-full border-x border-gray-400">
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
                            isInRoom={false}
                            isProcessing={props.isProcessing}
                            isSelectMode={props.isSelectMode}
                            selectedIds={props.selectedIds}
                            toggleSelect={props.toggleSelect}
                        />
                    )}
                </div>
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={(event: React.SubmitEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        props.sendChatToUser.mutate();
                    }}
                >
                    <div className="flex gap-1.5">
                        <textarea
                            className="focus:outline-0 w-[90%] resize-none"
                            id="message"
                            name="message"
                            onChange={(event) => props.setText(event.target.value)}
                            value={props.text}
                        />
                        <div className="flex flex-col gap-2 justify-center">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={props.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={props.isProcessing}
                                onClick={() => navigate(`/user/chat/preview/${props.receiverId}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
    );
}