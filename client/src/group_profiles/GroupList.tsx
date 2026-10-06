import GroupData from "./GroupData";
import type { IGroupProfileList } from "./model";

export default function GroupList(props: IGroupProfileList) {
    if (props.groups.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No group available...</span>
                </div>
            </div>
        );
    }

    return (
        <section className="px-2.5 pb-2.5 overflow-y-auto h-full flex flex-col gap-2.5">
            <div className="flex flex-col gap-2">
                {props.groups.map((group) => {
                    return (
                        <GroupData 
                            isProcessing={props.isProcessing} 
                            key={group._id}
                            group={group} 
                        />
                    );
                })}
            </div>
            {props.groups.length < 16 ? null : props.hasNextPage ? (
                <button
                    disabled={props.isProcessing}
                    className={`
                        cursor-pointer disabled:cursor-not-allowed bg-gray-400 
                        text-gray-950 font-medium p-1.5 text-[0.8rem] hover:bg-gray-300 transition-colors
                    `}
                    onClick={() => props.fetchNextPage()}
                    type="button"
                >
                    Load more
                </button>
            ) : props.isFetchingNextPage ? (
                <section className="flex justify-center">
                    <div className="animate-spin border-t-2 border-b-2 rounded-full w-9 h-9 border-blue-900"></div>
                </section>
            ) : (
                <div className="text-center text-[0.8rem] text-gray-950 font-medium">You've reached end</div>
            )}
        </section>
    );
}
