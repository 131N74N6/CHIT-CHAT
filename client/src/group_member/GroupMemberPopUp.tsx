import { ArrowLeft, MessageCircle } from "lucide-react";
import Loading from "../components/Loading";
import { useGroupChatStore } from "../group_chats/store";
import UserList from "../user_profiles/UserList";
import { useGroupMemberStore } from "./store";
import { useGroupProfileStore } from "../group_profiles/store";
import cn from "../utils/cn";
import type { IGroupMemberPopUp } from "./model";

export default function GroupMemberPopUp(props: IGroupMemberPopUp) {
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);
    const setFilesPopUp = useGroupChatStore((state) => state.setFilesPopUp);
    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);
    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const seeProfileGroup = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(true);
        setFilesPopUp(false);
    }

    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
            <div className="flex flex-col h-full w-full md:w-2/5 p-2.5 border border-gray-400 overflow-y-auto">
                <div className="flex gap-2">
                    <button 
                        className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-gray-900"
                        disabled={props.isProcessing}
                        onClick={seeProfileGroup}
                        type="button"
                    >
                        <ArrowLeft size={22}/>
                    </button>
                    <input
                        className="outline-none bg-gray-200 text-gray-900 font-medium p-1.5 text-[1rem] w-full"
                        placeholder="find room member..."
                        type="text"
                    />
                </div>
                {props.groupMembers.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : props.groupMembers.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center font-medium text-4xl text-gray-800">
                            {props.groupMembers.error.message}
                        </div>
                    </div>
                ) : (
                    <UserList
                        fetchNextUser={props.groupMembers.fetchNextPage}
                        hasNextPage={props.groupMembers.hasNextPage}
                        place={{ 
                            name: "group-member", 
                            isGroupOwner: props.groupMembers.isGroupOwner, 
                            kickMemberMt: props.groupMembers.kickMemberMt 
                        }}
                        isFetchingNextPage={props.groupMembers.isFetchingNextPage}
                        isProcessing={props.isProcessing}
                        users={props.groupMembers.data}
                    />
                )}
            </div>
            <div 
                className={cn(
                    "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                    "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                    "border border-gray-400"
                )}
            >
                <div className="flex flex-col gap-2">
                    <div className="text-gray-500 font-medium flex justify-center">
                        <MessageCircle size={34}/>
                    </div>
                    <div className="text-gray-700 font-medium text-center">
                        Welcome to Chit Chat
                    </div>
                </div>
            </div>
        </section>
    );
}