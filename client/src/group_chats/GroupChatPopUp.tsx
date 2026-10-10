import Loading from "../loading/Loading";
import { ArrowLeft, File, SendIcon, Settings2 } from "lucide-react";
import useGroupChatService from "./service";
import { useGroupChatStore } from "./store";
import useGroupProfileService from "../group_profiles/service";
import MessageList from "./MessageList";
import { useGroupProfileStore } from "../group_profiles/store";
import { useGroupMemberStore } from "../group_member/store";
import type { IGroupChatPopUp } from "./model";

export default function GroupChatPopUp(props: IGroupChatPopUp) {
    const setOpenPopUpOption = useGroupChatStore((state) => state.setOpenPopUpOption);
    const setShowGroupChatPopUp = useGroupChatStore((state) => state.setShowGroupChatPopUp);
    
    const setShowGroupChatFilesPopUp = useGroupChatStore((state) => state.setShowGroupChatFilesPopUp);
    const setShowGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.setShowGroupChatFilePreviewPopUp);
    
    const groupMessage = useGroupChatStore((state) => state.groupMessage);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    
    const chosenMessageFromGroup = useGroupChatStore((state) => state.chosenMessageFromGroup);
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);
    
    const selectMode = useGroupChatStore((state) => state.selectMode);
    const setSelectMode = useGroupChatStore((state) => state.setSelectMode);
    const resetChosenMessageIdsFromGroup = useGroupChatStore((state) => state.resetChosenMessageIdsFromGroup);
    
    const setShowMemberPopUp = useGroupMemberStore((state) => state.setShowMemberPopUp);

    const setShowProfile = useGroupProfileStore((state) => state.setShowProfile);

    const groupChat = useGroupChatService();
    const groupProfile = useGroupProfileService();

    const sendMessageToGroup = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (groupChat.isProcessing || groupProfile.isProcessing) return;

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

    const seeJoinedGroup = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    const seeProfileGroup = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(true);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(false);
    }

    const seeFilePreview = () => {
        setShowGroupChatPopUp(false);
        setShowMemberPopUp(false);
        setShowProfile(false);
        setShowGroupChatFilesPopUp(false);
        setShowGroupChatFilePreviewPopUp(true);
    }
    
    return (
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
            <header className="bg-zinc-800 flex justify-between p-2.5">
                <button 
                    className="flex-row flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                    disabled={groupChat.isProcessing}
                    onClick={seeProfileGroup}
                    type="button"
                >
                    {props.group_profile.picture.public_id !== "" ? (
                        <div className="w-8 h-8 rounded-full">
                            <img
                                className="w-full h-full object-cover rounded-full"
                                alt={`${props.group_profile.group_name}-picture`}
                                src={props.group_profile.picture.url}
                            />
                        </div>
                    ) : (
                        <div className="bg-amber-400 flex justify-center items-center w-8 h-8 rounded-full">
                            <p className="text-olive-800 font-medium">{props.group_profile?.group_name[0]}</p>
                        </div>
                    )}
                    <h3 className="text-white text-base text-left font-medium">
                        {props.group_profile?.group_name}
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
                    <button 
                        className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-white"
                        disabled={groupChat.isProcessing}
                        onClick={seeJoinedGroup}
                        type="button"
                    >
                        <ArrowLeft size={22}/>
                    </button>
                </section>
            </header>
            <div className="flex flex-col gap-2.5 px-2.5 h-full border-x border-gray-400">
                {props.group_chat.isLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : props.group_chat.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.group_chat.error.message}
                        </div>
                    </div>
                ) : (
                    <MessageList 
                        chats={props.group_chat.chats}
                        fetchNextPage={props.group_chat.fetchNextPage}
                        hasNextPage={props.group_chat.hasNextPage}
                        isFetchingNextPage={props.group_chat.isFetchingNextPage}
                        isProcessing={props.group_chat.isProcessing}
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
                            disabled={groupChat.isProcessing || groupProfile.isProcessing}
                            type="submit"
                        >
                            <SendIcon size={22}/>
                        </button>
                        <button 
                            className="text-blue-500 font-medium cursor-pointer disabled:cursor-not-allowed"
                            disabled={groupChat.isProcessing || groupProfile.isProcessing}
                            onClick={seeFilePreview}
                            type="button"
                        >
                            <File size={22}/>
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}