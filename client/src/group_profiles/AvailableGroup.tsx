import Loading from "../loading/Loading";
import Navbar from "../navbar/Navbar";
import { useEffect } from "react";
import { useMessageStore } from "../alert/useMessageStore";
import Alert from "../alert/Alert";
import GroupList from "./GroupList";
import useGroupProfileService from "./useGroupProfileService";
import useGroupChatService from "../group_chats/useGroupChatService";
import useGroupMemberService from "../group_members/useGroupMemberService";
import { useGroupChatStore } from "../group_chats/useGroupChatStore";
import PopUpOption from "../group_chats/PopUpOption";
import GroupChatPopUp from "../group_chats/GroupChatPopUp";
import { useGroupMemberStore } from "../group_members/useGroupMemberStore";
import GroupMemberPopUp from "../group_members/GroupMemberPopUp";
import { useGroupProfileStore } from "./useGroupProfileStore";
import GroupProfilePopUp from "./GroupProfilePopUp";
import GroupChatFilesPopUp from "../group_chats/GroupChatFilesPopUp";
import GroupChatFilesPreviewPopUp from "../group_chats/GroupChatFilesPreviewPopUp";

export default function AvailableGroup() {
    const groupId = useGroupChatStore((state) => state.groupId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const openPopUpOption = useGroupChatStore((state) => state.openPopUpOption);
    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);

    const showGroupChatPopUp = useGroupChatStore((state) => state.showGroupChatPopUp);

    const showGroupChatFilesPopUp = useGroupChatStore((state) => state.showGroupChatFilesPopUp);
    const showGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.showGroupChatFilePreviewPopUp);
    
    const showMemberPopUp = useGroupMemberStore((state) => state.showMemberPopUp);

    const showProfile = useGroupProfileStore((state) => state.showProfile);

    const groupChat = useGroupChatService();
    const groupProfile = useGroupProfileService();
    const groupMember = useGroupMemberService();
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    const groupOwnerId = groupProfile.showGroupDetail.data ? 
    groupProfile.showGroupDetail.data.owner_id : "";

    return (
        <section className="flex md:flex-row flex-col gap-2 p-2 h-dvh relative z-10">
            {message ? <Alert message={message}/> : null}
            <Navbar isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}/>
            {!openPopUpOption ? null : (
                <PopUpOption
                    isProcessing={groupChat.isProcessing}
                    clearAll={groupChat.clearAllMessageFromGroupMt}
                    chosenMessageIds={chosenMessageIdsFromGroup}
                    clearChosen={groupChat.clearChosenMessageFromGroupMt}
                    deleteAll={groupChat.deleteAllMessagesFromGroupMt}
                    deleteChosen={groupChat.deleteChosenMessagesFromGroupMt}
                />
            )}
            <main className="md:w-3/4 w-full h-full flex flex-col inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {groupProfile.showJoinedGroup.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : groupProfile.showJoinedGroup.error ?(
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {groupProfile.showJoinedGroup.error.message}
                        </div>
                    </div>
                ) : groupId && groupId !== "" && showGroupChatPopUp ? (
                    <GroupChatPopUp 
                        group_chat={{
                            changeChosenMessageMt: groupChat.changeChosenMessageMt,
                            chats: groupChat.showAllGroupMessages.data ? 
                            groupChat.showAllGroupMessages.data.pages.flatMap(page => page).reverse() : [],
                            
                            fetchNextPage: groupChat.showAllGroupMessages.fetchNextPage,
                            hasNextPage: groupChat.showAllGroupMessages.hasNextPage,
                            isFetchingNextPage: groupChat.showAllGroupMessages.isFetchingNextPage,
                            isLoading: groupChat.showAllGroupMessages.isLoading,
                            error: groupChat.showAllGroupMessages.error,
                            isProcessing: groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing,
                            sendChatToGroup: groupChat.sendChatToGroup
                        }} 
                        group_profile={{
                            _id: groupProfile.showGroupDetail.data ?
                            groupProfile.showGroupDetail.data._id : "-",

                            group_description: groupProfile.showGroupDetail.data ?
                            groupProfile.showGroupDetail.data.group_description : "-",

                            picture: {
                                file_name: groupProfile.showGroupDetail.data &&
                                groupProfile.showGroupDetail.data.group_profile.file_name !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.file_name : "-",

                                file_type: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.file_type !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.file_type : "-",

                                public_id: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.public_id !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.public_id : "-",

                                resource_type: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.resource_type !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.resource_type : "-",

                                url: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.url !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.url : "-"
                            },
                            group_name: groupProfile.showGroupDetail.data ?
                            groupProfile.showGroupDetail.data.group_name : "-"
                        }}
                    />
                ) : groupId && groupId !== "" && showMemberPopUp ? (
                    <GroupMemberPopUp 
                        groupMembers={{
                            data: groupMember.showGroupMembers.data ? 
                            groupMember.showGroupMembers.data.pages.flat() : [],

                            error: groupMember.showGroupMembers.error,
                            fetchNextPage: groupMember.showGroupMembers.fetchNextPage,
                            hasNextPage: groupMember.showGroupMembers.hasNextPage,
                            isFetchingNextPage: groupMember.showGroupMembers.isFetchingNextPage,
                            groupOwnerId: groupOwnerId,
                            isLoading: groupMember.showGroupMembers.isLoading,
                            kickMemberMt: groupMember.kickMemberMt
                        }}
                        
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                    />
                ) : groupId && groupId !== "" && showProfile ? (
                    <GroupProfilePopUp 
                        groupMember={{
                            leftGroupMt: groupMember.leftGroupMt
                        }} 
                        groupProfile={{
                            _id: groupProfile.showGroupDetail.data ? 
                            groupProfile.showGroupDetail.data._id : "-",
                            
                            changeGroupMt: groupProfile.changeGroupMt,

                            created_at: groupProfile.showGroupDetail.data ? 
                            groupProfile.showGroupDetail.data.created_at : new Date(),

                            deleteGroupMt: groupProfile.deleteGroupMt,
                            deleteGroupProfilePictureMt: groupProfile.deleteGroupProfilePictureMt,

                            description: groupProfile.showGroupDetail.data ? 
                            groupProfile.showGroupDetail.data.group_description : "-",

                            error: groupProfile.showGroupDetail.error,
                            fileInputRef: groupProfile.fileInputRef,
                            handleImagePreview: groupProfile.handleImagePreview,

                            picture: {
                                file_name: groupProfile.showGroupDetail.data &&
                                groupProfile.showGroupDetail.data.group_profile.file_name !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.file_name : "-",

                                file_type: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.file_type !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.file_type : "-",

                                public_id: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.public_id !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.public_id : "-",

                                resource_type: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.resource_type !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.resource_type : "-",

                                url: groupProfile.showGroupDetail.data && 
                                groupProfile.showGroupDetail.data.group_profile.url !== "-" ?
                                groupProfile.showGroupDetail.data.group_profile.url : "-"
                            },
                            group_name: groupProfile.showGroupDetail.data ? 
                            groupProfile.showGroupDetail.data.group_name : "-",

                            isLoading: groupProfile.showGroupDetail.isLoading,
                            groupOwnerId: groupOwnerId
                        }} 
                        
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                    />
                ) : groupId && groupId !== "" && showGroupChatFilesPopUp ? (
                    <GroupChatFilesPopUp 
                        error={groupChat.showFilesThatSentToGroup.error} 
                        files={groupChat.showFilesThatSentToGroup.data ? groupChat.showFilesThatSentToGroup.data.files : []}
                        isLoading={groupChat.showFilesThatSentToGroup.isLoading} 
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                    />
                ) : groupId && groupId !== "" && showGroupChatFilePreviewPopUp ? (
                    <GroupChatFilesPreviewPopUp 
                        handleMediaPreview={groupChat.handleMediaPreview} 
                        inputMediaRef={groupChat.inputMediaRef} 
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing} 
                        sendChatToGroup={groupChat.sendChatToGroup}
                    />
                ) : (
                    <GroupList
                        fetchNextPage={groupProfile.showJoinedGroup.fetchNextPage}
                        hasNextPage={groupProfile.showJoinedGroup.hasNextPage}
                        isFetchingNextPage={groupProfile.showJoinedGroup.isFetchingNextPage}
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                        groups={groupProfile.showJoinedGroup.data ? groupProfile.showJoinedGroup.data.pages.flat() : []}
                    />
                )}
            </main>
        </section>
    );
}