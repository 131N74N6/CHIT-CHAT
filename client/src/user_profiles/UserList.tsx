import cn from "../utils/cn";
import Loading from "../loading/Loading";
import UserData from "./UserData";
import type { UserList } from "./model";
import { useUserStore } from "./store";

export default function UserList(props: UserList) {
    const currentUserId = useUserStore((state) => state.currentUserId);
    
    if (props.users.length === 0) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="bg-white">
                    <span className="text-gray-700 font-semibold text-[1rem]">No users found...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 py-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2">
                {props.users.map((user) => {
                    return (
                        <UserData 
                            isProcessing={props.isProcessing}
                            isOwnData={currentUserId === user._id}
                            key={`user-${user._id}`}
                            place={props.place}
                            user={user} 
                        />
                    );
                })}
            </div>
            {props.users.length <= 14 ? null : (                
                <div className="flex justify-center">
                    {props.isFetchingNextPage ? (
                        <Loading/>
                    ) : props.hasNextPage ? (
                        <button
                            disabled={props.isProcessing}
                            className={cn(
                                "cursor-pointer disabled:cursor-not-allowed bg-gray-400 text-gray-950", 
                                "font-medium p-1.5 text-[0.8rem] hover:bg-gray-300 transition-colors"
                            )}
                            onClick={() => props.fetchNextUser()}
                            type="button"
                        >
                            Load more
                        </button>
                    ) : (
                        <div className="text-center text-[0.8rem] text-gray-950 font-medium">No more user to show</div>
                    )}
                </div>
            )}
        </div>
    );
}