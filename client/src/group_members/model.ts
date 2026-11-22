import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult } from "@tanstack/react-query";
import type { Users } from "../user_profiles/model";

export interface IGroupMemberState {
    searchedGroupMember: string;
    setSearchedGroupMember: (searchedGroupMember: string) => void

    showMemberPopUp: boolean;
    setShowMemberPopUp: (showMemberPopUp: boolean) => void;
    
    resetGroupMemberState: () => void;
}

export interface GroupMembersMarks {
    isGroupOwner: boolean;
    kickMemberMt: UseMutationResult<any, Error, string, unknown>;
    name: "group-member";
}

export interface IGroupMemberPopUp {
    groupMembers: {
        data: Users[];
        error: Error | null;
        fetchNextPage: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<Users[], unknown>, Error>>
        hasNextPage: boolean;
        isFetchingNextPage: boolean;
        isGroupOwner: boolean;
        isLoading: boolean;
        kickMemberMt: UseMutationResult<void, Error, string, unknown>;
    }
    isProcessing: boolean;
}