import ChatList from "./MessageList";
import useUserChatService from "./service";
import Loading from "../loading/Loading";
import { File, SendIcon, Settings2, X } from "lucide-react";
import { useUserChatStore } from "./store";
import useUserProfileService from "../user_profiles/service";
import { useUserStore } from "../user_profiles/store";
import type { IUserChatPopUp } from "./model";

export default function UserChatPopUp(props: IUserChatPopUp) {
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

    const userChat = useUserChatService();
    const user = useUserProfileService();

    const sendMessage = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (userChat.isProcessing) return;

        if (selectMode && chosenMessage) {
            if (!text.trim() || chosenMessage.text.trim() === text.trim()) {
                setChosenMessage(null);
                setText("");
                setSelectMode(false);
                resetChosenMessageIds();
                return;
            }
            
            userChat.changeMessageMt.mutate(chosenMessage._id);
            return
        }

        userChat.sendMessageMt.mutate();
    }

    const closeUserChatPopUp = () => {
        setShowUserMedia(false);
        setShowUserChatPopUp(false);
        setShowUserChatFilesPopUp(false);
        setShowUserProfilePopUp(false);
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
        <section className="h-full overflow-y-auto p-2.5 md:flex hidden flex-col w-full md:w-2/5">
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
                        {user.showOtherUser.data && user.showOtherUser.data.image_public_id ? (
                            <div className="w-8 h-8 rounded-full">
                                <img
                                    className="w-full h-full object-cover rounded-full"
                                    alt={`${user.showOtherUser.data.name}-picture`}
                                    src={user.showOtherUser.data.image}
                                />
                            </div>
                        ) : (
                            <div className="bg-amber-400 flex justify-center items-center w-8 h-8 rounded-full">
                                <p className="text-olive-800 font-medium">{user.showOtherUser.data?.name[0]}</p>
                            </div>
                        )}
                        <h3 className="text-white text-base text-left font-medium">
                            {user.showOtherUser.data?.name}
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
            <div className="flex flex-col gap-2.5 px-2.5 h-[80%] border-x border-gray-400">
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
            </div>
            <form 
                className="bg-white relative h-[20%] inset-shadow-gray-200 p-1.5 flex flex-col gap-1.5 border border-gray-400"
                onSubmit={sendMessage}
            >
                <textarea
                    className="focus:outline-0 outline-0 w-full h-full resize-none pr-12"
                    id="message"
                    name="message"
                    onChange={(event) => setText(event.target.value)}
                    value={text}
                />
                <div className="absolute bottom-2 right-2 top-2 flex items-center bg-white">
                    <div className="flex flex-col gap-2.5">
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
                    </div>
                </div>
            </form>
        </section>
    );
}