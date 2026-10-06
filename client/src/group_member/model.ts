import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";

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