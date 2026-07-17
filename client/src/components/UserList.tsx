import type { UserListIntrf } from "../models/user.model";
import cn from "../utils/cn";
import Loading from "./Loading";
import UserData from "./UserData";

export default function UserList(props: UserListIntrf) {
    return (
        <div className="flex flex-col gap-2.5 overflow-y-auto">
            <div className="flex flex-col gap-2">
                {props.users.map((user) => {
                    return (
                        <UserData 
                            key={user._id}
                            setReceiverId={props.setReceiverId} 
                            user={user} 
                        />
                    );
                })}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ? (
                    <Loading/>
                ) : props.users.length <= 14 ? (
                    <></>
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
        </div>
    );
}