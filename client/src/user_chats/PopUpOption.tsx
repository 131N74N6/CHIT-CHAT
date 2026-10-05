import cn from "../utils/cn";
import type { iPopUpOptionForUser } from "./model";
import { useUserChatStore } from "./store";

export default function PopUpOption(props: iPopUpOptionForUser) {
    const resetChosenMessageIds = useUserChatStore((state) => state.resetChosenMessageIds);
    const setChosenMessage = useUserChatStore((state) => state.setChosenMessage);
    const setText = useUserChatStore((state) => state.setText);
    const setOpenPopUpOption = useUserChatStore((state) => state.setOpenPopUpOption);

    const selectMode = useUserChatStore((state) => state.selectMode);
    const setSelectMode = useUserChatStore((state) => state.setSelectMode);
    
    const closePopUp = () => {
        resetChosenMessageIds();
        setChosenMessage(null);
        setText("");
        setOpenPopUpOption(false);
        setSelectMode(false);
    }

    const startSelectMode = () => {
        setOpenPopUpOption(false);
        setSelectMode(true);
    }
    
    return (
        <div className="flex justify-center items-center h-full z-20 inset-0 fixed bg-[rgba(0,0,0,0.5)]">
            <section className="bg-white flex flex-col gap-2.5 p-2.5 rounded-md">
                <h3 className="font-medium text-center text-base">
                    What will you dou about all these messages?
                </h3>
                <button
                    className={cn(
                        "cursor-pointer ring ring-zinc-800 disabled:cursor-not-allowed", 
                        "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md",
                    )}
                    disabled={props.isProcessing}
                    onClick={closePopUp}
                    type="button"
                >
                    Close
                </button>
                {selectMode ? null : (
                    <button
                        className={cn(
                            "cursor-pointer ring ring-zinc-800 disabled:cursor-not-allowed", 
                            "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md"
                        )}
                        disabled={props.isProcessing}
                        onClick={startSelectMode}
                        type="button"
                    >
                        Select message
                    </button>
                )}
                {props.chosenMessageIds.length === 0 ? (
                    <>
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed ring ring-zinc-800", 
                                "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md" 
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.deleteAll.mutate()}
                            type="button"
                        >
                            Delete All Messages
                        </button>
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed ring ring-zinc-800", 
                                "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md" 
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.clearAll.mutate()}
                            type="button"
                        >
                            Clear All Messages
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed ring ring-zinc-800", 
                                "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md" 
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.deleteChosen.mutate()}
                            type="button"
                        >
                            Delete Chosen Messages
                        </button>
                        <button
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed ring ring-zinc-800", 
                                "bg-white text-zinc-800 font-medium text-sm p-2 w-full rounded-md" 
                            )}
                            disabled={props.isProcessing}
                            onClick={() => props.clearChosen.mutate()}
                            type="button"
                        >
                            Clear Chosen Messages
                        </button>
                    </>
                )}
            </section>
        </div>
    );
}
