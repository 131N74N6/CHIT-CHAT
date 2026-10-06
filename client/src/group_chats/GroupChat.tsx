import Alert from "../components/Alert";
import cn from "../utils/cn";
import Loading from "../components/Loading";
import { File, MessageCircle, SendIcon, Settings2 } from "lucide-react";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import useGroupChatService from "./service";
import { useGroupChatStore } from "./store";
import PopUpOption from "./PopUpOption";
import useGroupProfileService from "../group_profiles/service";
import MessageList from "./MessageList";

export default function GroupChat() {
    const { room_id } = useParams();
    const navigate = useNavigate();

    const openPopUpOption = useGroupChatStore((state) => state.openPopUpOption);
    const setOpenPopUpOption = useGroupChatStore((state) => state.setOpenPopUpOption);

    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);

    const groupId = useGroupChatStore((state) => state.groupId);
    const setGroupId = useGroupChatStore((state) => state.setGroupId);

    const groupMessage = useGroupChatStore((state) => state.groupMessage);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);
    
    const chosenMessageFromGroup = useGroupChatStore((state) => state.chosenMessageFromGroup);
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);

    const selectMode = useGroupChatStore((state) => state.selectMode);
    const setSelectMode = useGroupChatStore((state) => state.setSelectMode);

    const resetChosenMessageIdsFromGroup = useGroupChatStore((state) => state.resetChosenMessageIdsFromGroup);

    const groupChat = useGroupChatService();
    const groupProfile = useGroupProfileService();

    useEffect(() => {
        if (room_id) setGroupId(room_id);
    }, [room_id, setGroupId])

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const sendMessageToGroup = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (groupChat.isProcessing) return;

        if (selectMode && chosenMessageFromGroup) {
            if (!groupMessage.trim() || groupMessage.trim() === chosenMessageFromGroup.text) {
                setChosenMessageFromGroup(null);
                setGroupMessage("");
                setSelectMode(false);
                resetChosenMessageIdsFromGroup();
                return;
            }

            groupChat.changeChosenMessageMt.mutate(chosenMessageFromGroup._id);
            return;
        }

        groupChat.sendChatToGroup.mutate();
    }

    return (
        <section className="flex md:flex-row gap-2.5 p-2.5 flex-col relative h-dvh z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={groupChat.isProcessing}/>
            {!openPopUpOption ? null : (
                <PopUpOption
                    isProcessing={groupChat.isProcessing}
                    clearAll={groupChat.clearAllMessageFromGroupMt}
                    chosenMessageIds={chosenMessageIdsFromGroup}
                    clearChosen={groupChat.clearChosenMessageFromGroupMt}
                    deleteAll={groupChat.deleteAllMessagesFromGroupMt}
                    deleteChosen={groupChat.deleteChosenMessagesFromGroupMt}
                />
            )}
            <main className="h-full overflow-y-auto p-2.5 flex flex-col w-full md:w-2/5">
                <header className="bg-zinc-800 flex justify-between p-2.5">
                    <button 
                        className="flex-row flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                        disabled={groupChat.isProcessing}
                        onClick={() => navigate(`/rooms/profile/${groupId}`)}
                        type="button"
                    >
                        {groupProfile.showGroupDetail.data && 
                        groupProfile.showGroupDetail.data.group_profile.public_id !== "" ? (
                            <div className="w-8 h-8 rounded-full">
                                <img
                                    className="w-full h-full object-cover rounded-full"
                                    alt={`${groupProfile.showGroupDetail.data.group_name}-picture`}
                                    src={groupProfile.showGroupDetail.data.group_profile.url}
                                />
                            </div>
                        ) : (
                            <div className="bg-amber-400 flex justify-center items-center w-8 h-8 rounded-full">
                                <p className="text-olive-800 font-medium">{groupProfile.showGroupDetail.data?.group_name[0]}</p>
                            </div>
                        )}
                        <h3 className="text-white text-base text-left font-medium">
                            {groupProfile.showGroupDetail.data?.group_name}
                        </h3>
                    </button>
                    <section className="flex gap-2">
                        <button 
                            className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-white"
                            disabled={groupChat.isProcessing}
                            onClick={() => setOpenPopUpOption(true)}
                            type="button"
                        >
                            <Settings2 size={22}/>
                        </button>
                    </section>
                </header>
                <div className="flex flex-col gap-2.5 px-2.5 h-full border-x border-gray-400">
                    {groupChat.showAllGroupMessages.isLoading ? (
                        <div className="flex justify-center items-center bg-white h-full">
                            <Loading/>
                        </div>
                    ) : groupChat.showAllGroupMessages.error ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="text-gray-700 font-medium text-center">
                                {groupChat.showAllGroupMessages.error.message}
                            </div>
                        </div>
                    ) : (
                        <MessageList 
                            chats={groupChat.showAllGroupMessages.data? 
                                groupChat.showAllGroupMessages.data.pages.flatMap(page => page).reverse() : []
                            }
                            fetchNextPage={groupChat.showAllGroupMessages.fetchNextPage}
                            hasNextPage={groupChat.showAllGroupMessages.hasNextPage}
                            isFetchingNextPage={groupChat.showAllGroupMessages.isFetchingNextPage}
                            isProcessing={groupChat.isProcessing}
                        />
                    )}
                </div>
                <form 
                    className="bg-white inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                    onSubmit={sendMessageToGroup}
                >
                    <div className="flex gap-1.5">
                        <textarea
                            className="focus:outline-0 w-[90%] resize-none"
                            id="message"
                            name="message"
                            onChange={(event) => setGroupMessage(event.target.value)}
                            value={groupMessage}
                        />
                        <div className="flex flex-col gap-2 justify-center">
                            <button
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={groupChat.isProcessing}
                                type="submit"
                            >
                                <SendIcon size={22}/>
                            </button>
                            <button 
                                className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                                disabled={groupChat.isProcessing}
                                onClick={() => navigate(`/rooms/chat/preview/${groupId}`)}
                                type="button"
                            >
                                <File size={22}/>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
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