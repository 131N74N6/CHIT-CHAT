import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult, UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { Users, UsersMarks } from "../user_profiles/model";
import type { ApiResponse } from "../api";

export interface IGroupMemberState {
    showMemberPopUp: boolean;
    setShowMemberPopUp: (showMemberPopUp: boolean) => void;
    
    resetGroupMemberState: () => void;
}

export interface GroupMembersMarks {
    isGroupOwner: UseQueryResult<boolean, Error>;
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
        isGroupOwner: UseQueryResult<boolean, Error>;
        isLoading: boolean;
        kickMemberMt: UseMutationResult<ApiResponse<unknown>, Error, string, unknown>
        place: GroupMembersMarks | UsersMarks;
    }
    isProcessing: boolean;
}