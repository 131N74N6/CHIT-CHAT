import ChatList from "./MessageList";
import Loading from "../loading/Loading";
import { File, SendIcon, Settings2, X } from "lucide-react";
import { useUserChatStore } from "./store";
import { useUserStore } from "../user_profiles/store";
import type { IUserChatPopUp } from "./model";
import { useEffect } from "react";

export default function UserChatPopUp(props: IUserChatPopUp) {
    const chosenMessageIds = useUserChatStore((state) => state.chosenMessageIds);

    const text = useUserChatStore((state) => state.text);
    const setText = useUserChatStore((state) => state.setText);

    const chosenMessage = useUserChatStore((state) => state.chosenMessage);
    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);

    const setOpenPopUpOption = useUserChatStore((state) => state.setOpenPopUpOption);

    const setShowUserChatFilesPopUp = useUserChatStore((state) => state.setShowUserChatFilesPopUp);
    const setShowUserMedia = useUserChatStore((state) => state.setShowUserMedia);

    const resetChosenMessageIds = useUserChatStore((state) => state.resetChosenMessageIds);
    const setShowUserChatPopUp = useUserChatStore((state) => state.setShowUserChatPopUp);

    const selectMode = useUserChatStore((state) => state.selectMode);
    const setSelectMode = useUserChatStore((state) => state.setSelectMode);

    const setShowUserProfilePopUp = useUserStore((state) => state.setShowUserProfilePopUp);
    
    useEffect(() => {
        const canEdit = selectMode && 
        chosenMessageIds.length === 1 && 
        chosenMessage && 
        chosenMessage.text !== "This message has been deleted";
        
        if (canEdit) {
            setText(chosenMessage.text);
        } else {
            setText("");
        }
    }, [selectMode, chosenMessageIds, chosenMessage, setText]);

    const sendMessage = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (props.userChat.isProcessing) return;

        if (selectMode && chosenMessage) {
            if (!text.trim() || chosenMessage.text.trim() === text.trim()) {
                setChosenMessage(null);
                setText("");
                setSelectMode(false);
                resetChosenMessageIds();
                return;
            }
            
            props.userChat.changeMessageMt.mutate(chosenMessage._id);
            return
        }

        props.userChat.sendMessageMt.mutate();
    }

    const closeUserChatPopUp = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
        setChosenMessage(null);
    }

    const seeUserProfile = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(true);
    }

    const seeFilePreview = () => {
        setShowUserMedia(true);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
    }

    return (
        <section className="h-full flex flex-col w-full">
            <header className="bg-zinc-800 flex justify-between p-2.5">
                {props.userProfile.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.userProfile.error.message}
                        </div>
                    </div>
                ) : props.userProfile.isLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : (
                    <button 
                        className="flex-row flex items-center gap-2.5 cursor-pointer disabled:cursor-not-allowed"
                        disabled={props.isProcessing}
                        onClick={seeUserProfile}
                        type="button"
                    >
                        {props.userProfile.image_public_id && props.userProfile.image_public_id !== "" ? (
                            <div className="w-8 h-8 rounded-full">
                                <img
                                    className="w-full h-full object-cover rounded-full"
                                    alt={`${props.userProfile.name}-picture`}
                                    src={props.userProfile.image}
                                />
                            </div>
                        ) : (
                            <div className="bg-amber-400 flex justify-center items-center w-8 h-8 rounded-full">
                                <p className="text-olive-800 font-medium">{props.userProfile.name[0]}</p>
                            </div>
                        )}
                        <h3 className="text-white text-base text-left font-medium">
                            {props.userProfile?.name}
                        </h3>
                    </button>
                )}
                <section className="flex gap-2">
                    <button 
                        className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-white"
                        disabled={props.isProcessing}
                        onClick={() => setOpenPopUpOption(true)}
                        type="button"
                    >
                        <Settings2 size={22}/>
                    </button>
                    <button 
                        className="text-base font-medium cursor-pointer disabled:cursor-not-allowed text-white"
                        disabled={props.isProcessing}
                        onClick={closeUserChatPopUp}
                        type="button"
                    >
                        <X size={22}/>
                    </button>
                </section>
            </header>
            <main className="h-full overflow-y-auto p-2.5 flex flex-col w-full">
                {props.userChat.isLoading ? (
                    <div className="flex justify-center items-center bg-white h-full">
                        <Loading/>
                    </div>
                ) : props.userChat.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {props.userChat.error.message}
                        </div>
                    </div>
                ) : (
                    <ChatList 
                        chats={props.userChat.data} 
                        fetchNextPage={props.userChat.fetchNextPage}
                        hasNextPage={props.userChat.hasNextPage}
                        isFetchingNextPage={props.userChat.isFetchingNextPage}
                        isProcessing={props.isProcessing}
                    />
                )}
                <form 
                    className="bg-white border overflow-y-auto border-gray-400 relative p-2 flex w-full h-[20%] items-center gap-2"
                    onSubmit={sendMessage}
                >
                    <textarea
                        className="outline-0 w-full h-full resize-none pr-12"
                        id="message"
                        name="message"
                        onChange={(event) => setText(event.target.value)}
                        value={text}
                    />
                    <section className="flex flex-col gap-1.5">
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
                            onClick={seeFilePreview}
                            type="button"
                        >
                            <File size={22}/>
                        </button>
                    </section>
                </form>
            </main>
        </section>
    );
}