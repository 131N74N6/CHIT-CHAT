import Loading from "../loading/Loading";
import Navbar from "../navbar/Navbar";
import { MessageCircle } from "lucide-react";
import cn from "../utils/cn";
import { useEffect } from "react";
import { useMessageStore } from "../stores/message.store";
import Alert from "../components/Alert";
import GroupList from "./GroupList";
import useGroupProfileService from "./service";
import useGroupChatService from "../group_chats/service";
import useGroupMemberService from "../group_member/service";
import { useGroupChatStore } from "../group_chats/store";
import PopUpOption from "../group_chats/PopUpOption";
import GroupChatPopUp from "../group_chats/GroupChatPopUp";
import { useGroupMemberStore } from "../group_member/store";
import GroupMemberPopUp from "../group_member/GroupMemberPopUp";
import { useUserStore } from "../user_profiles/store";
import { useGroupProfileStore } from "./store";
import GroupDetailPopUp from "./GroupDetailPopUp";
import GroupChatFilesPopUp from "../group_chats/GroupChatFilesPopUp";
import GroupChatFilesPreviewPopUp from "../group_chats/GroupChatFilesPreviewPopUp";

export default function AvailableGroup() {
    const groupId = useGroupChatStore((state) => state.groupId);

    const message = useMessageStore((state) => state.message);
    const setMessage = useMessageStore((state) => state.setMessage);

    const openPopUpOption = useGroupChatStore((state) => state.openPopUpOption);
    const chosenMessageIdsFromGroup = useGroupChatStore((state) => state.chosenMessageIdsFromGroup);

    const showGroupChatPopUp = useGroupChatStore((state) => state.showGroupChatPopUp);
    
    const editMode = useGroupProfileStore((state) => state.editMode);
    const setGroupDescription = useGroupProfileStore((state) => state.setGroupDescription);

    const setGroupName = useGroupProfileStore((state) => state.setGroupName);
    const setOldGroupProfilePicture = useGroupProfileStore((state) => state.setOldGroupProfilePicture);
    
    const setSelectedProfileGroup = useGroupProfileStore((state) => state.setSelectedProfileGroup);
    const setSelectedProfileGroupUrl = useGroupProfileStore((state) => state.setSelectedProfileGroupUrl);

    const showGroupChatFilesPopUp = useGroupChatStore((state) => state.showGroupChatFilesPopUp);
    const showGroupChatFilePreviewPopUp = useGroupChatStore((state) => state.showGroupChatFilePreviewPopUp);
    
    const showMemberPopUp = useGroupMemberStore((state) => state.showMemberPopUp);

    const showProfile = useGroupProfileStore((state) => state.showProfile);

    const groupChat = useGroupChatService();
    const groupProfile = useGroupProfileService();
    const groupMember = useGroupMemberService();

    const currentUserId = useUserStore((state) => state.currentUserId);
    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [message, setMessage]);

    useEffect(() => {
        if (editMode) {
            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_name ?
            setGroupName(groupProfile.showGroupDetail.data.group_name) :
            setGroupName("-");

            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_description ? 
            setGroupDescription(groupProfile.showGroupDetail.data.group_description) :
            setGroupDescription("-");

            groupProfile.showGroupDetail.data && groupProfile.showGroupDetail.data.group_profile.public_id !== "" ? 
            setOldGroupProfilePicture(groupProfile.showGroupDetail.data.group_profile) :
            setOldGroupProfilePicture({
                file_name: "",
                file_type: "",
                public_id: "",
                resource_type: "",
                size: 0,
                url: "",
            });
        } else {
            setGroupDescription("-");
            setGroupName("-");
            setSelectedProfileGroup(null);
            setOldGroupProfilePicture({
                file_name: "",
                file_type: "",
                public_id: "",
                resource_type: "",
                size: 0,
                url: "",
            });
            setSelectedProfileGroupUrl("");
        }
    }, [editMode, groupId, groupProfile.showGroupDetail.data]);

    const isGroupOwner = currentUserId === groupProfile.showGroupDetail.data?.owner_id;

    return (
        <section className="flex md:flex-row flex-col gap-2.5 p-2.5 h-dvh relative z-10">
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
            <div className="flex flex-col md:w-2/5 h-full px-2.5 w-full inset-shadow-sm inset-shadow-gray-400 border border-gray-400 overflow-y-auto">
                {groupProfile.showJoinedGroup.isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : groupProfile.showJoinedGroup.error ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-700 font-medium text-center">
                            {groupProfile.showJoinedGroup.error.message}
                        </div>
                    </div>
                ) : (
                    <GroupList
                        fetchNextPage={groupProfile.showJoinedGroup.fetchNextPage}
                        hasNextPage={groupProfile.showJoinedGroup.hasNextPage}
                        isFetchingNextPage={groupProfile.showJoinedGroup.isFetchingNextPage}
                        isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                        groups={groupProfile.showJoinedGroup.data ? groupProfile.showJoinedGroup.data.pages.flat() : []}
                    />
                )}
            </div>
            {groupId ? (
                <>
                    {showGroupChatPopUp ? (
                        <GroupChatPopUp 
                            group_chat={{
                                chats: groupChat.showAllGroupMessages.data ? 
                                groupChat.showAllGroupMessages.data.pages.flatMap(page => page).reverse() : [],

                                fetchNextPage: groupChat.showAllGroupMessages.fetchNextPage,
                                hasNextPage: groupChat.showAllGroupMessages.hasNextPage,
                                isFetchingNextPage: groupChat.showAllGroupMessages.isFetchingNextPage,
                                isLoading: groupChat.showAllGroupMessages.isLoading,
                                error: groupChat.showAllGroupMessages.error,
                                isProcessing: groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing
                            }} 
                            group_profile={{
                                _id: groupProfile.showGroupDetail.data ?
                                groupProfile.showGroupDetail.data._id : "-",

                                group_description: groupProfile.showGroupDetail.data ?
                                groupProfile.showGroupDetail.data.group_description : "-",

                                picture: {
                                    file_name: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.file_name : "-",

                                    file_type: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.file_type : "-",

                                    public_id: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.file_name : "-",

                                    resource_type: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.resource_type : "-",

                                    size: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.size : 0,

                                    url: groupProfile.showGroupDetail.data ?
                                    groupProfile.showGroupDetail.data.group_profile.url : "-"
                                },
                                group_name: groupProfile.showGroupDetail.data ?
                                groupProfile.showGroupDetail.data.group_name : "-"
                            }}
                        />
                    ) : null}
                    {showMemberPopUp ? (
                        <GroupMemberPopUp 
                            groupMembers={{
                                data: groupMember.showGroupMembers.data ? 
                                groupMember.showGroupMembers.data.pages.flat() : [],

                                error: groupMember.showGroupMembers.error,
                                fetchNextPage: groupMember.showGroupMembers.fetchNextPage,
                                hasNextPage: groupMember.showGroupMembers.hasNextPage,
                                isFetchingNextPage: groupMember.showGroupMembers.isFetchingNextPage,
                                isGroupOwner: groupMember.isGroupOwner,
                                isLoading: groupMember.showGroupMembers.isLoading,
                                kickMemberMt: groupMember.kickMemberMt,
                                place: { 
                                    name: "group-member", 
                                    isGroupOwner: groupMember.isGroupOwner, 
                                    kickMemberMt: groupMember.kickMemberMt 
                                }
                            }}
                            isProcessing={false}
                        />
                    ) : null}
                    {showProfile ? (
                        <GroupDetailPopUp 
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
                                    file_name: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.file_name : "-",

                                    file_type: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.file_type : "-",

                                    public_id: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.public_id : "-",

                                    resource_type: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.resource_type : "-",

                                    size: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.size : 0,
                                    
                                    url: groupProfile.showGroupDetail.data ? 
                                    groupProfile.showGroupDetail.data.group_profile.url : "-"
                                },
                                group_name: groupProfile.showGroupDetail.data ? 
                                groupProfile.showGroupDetail.data.group_name : "-",

                                isLoading: false,
                                isGroupOwner: isGroupOwner
                            }} 
                            isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                        />
                    ) : null}
                    {showGroupChatFilesPopUp ? (
                        <GroupChatFilesPopUp 
                            error={groupChat.showFilesThatSentToGroup.error} 
                            files={groupChat.showFilesThatSentToGroup.data ? groupChat.showFilesThatSentToGroup.data.files : []}
                            isLoading={groupChat.showFilesThatSentToGroup.isLoading} 
                            isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing}
                        />
                    ) : null}
                    {showGroupChatFilePreviewPopUp ? (
                        <GroupChatFilesPreviewPopUp 
                            handleMediaPreview={groupChat.handleMediaPreview} 
                            inputMediaRef={groupChat.inputMediaRef} 
                            isProcessing={groupChat.isProcessing || groupMember.isProcessing || groupProfile.isProcessing} 
                            sendChatToGroup={groupChat.sendChatToGroup}
                        />
                    ) : null}
                </>
            ) : (
                <div 
                    className={cn(
                        "md:flex md:justify-center md:items-center md:h-full md:w-2/5", 
                        "md:bg-white hidden inset-shadow-sm inset-shadow-gray-400",
                        "border border-gray-400"
                    )}
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-gray-500 font-medium flex justify-center">
                            <MessageCircle size={34}/>
                        </div>
                        <div className="text-gray-700 font-medium text-center">
                            Welcome to Chit Chat
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}