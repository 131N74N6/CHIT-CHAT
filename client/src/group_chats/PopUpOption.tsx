import cn from "../utils/cn";
import type { iPopUpOptionForGroup } from "./model";
import { useGroupChatStore } from "./store";

export default function PopUpOption(props: iPopUpOptionForGroup) {
    const resetChosenMessageIdsFromGroup = useGroupChatStore((state) => state.resetChosenMessageIdsFromGroup);
    const setChosenMessageFromGroup = useGroupChatStore((state) => state.setChosenMessageFromGroup);
    const setGroupMessage = useGroupChatStore((state) => state.setGroupMessage);
    const setOpenPopUpOption = useGroupChatStore((state) => state.setOpenPopUpOption);

    const selectMode = useGroupChatStore((state) => state.selectMode);
    const setSelectMode = useGroupChatStore((state) => state.setSelectMode);
    
    function closePopUp() {
        resetChosenMessageIdsFromGroup();
        setChosenMessageFromGroup(null);
        setGroupMessage("");
        setOpenPopUpOption(false);
        setSelectMode(false);
    }

    function startSelectMode() {
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
