export interface UserState {
    address: string;
    setAddress: (address: string) => void;

    currentUserId: string | undefined;
    setCurrentUserId: (currentUserId: string | undefined) => void;

    currentUserRoomIds: string[] | undefined;
    setCurrentUserRoomIds: (currentUserRoomIds: string[] | undefined) => void;

    description: string;
    setDescription: (description: string) => void;

    editMode: boolean;
    setEditMode: (editMode: boolean) => void;

    gender: string;
    setGender: (gender: string) => void;

    profilePicture: File | null;
    setProfilePicture: (profilePicture: File | null) => void;

    profilePictureUrl: string | null;
    setProfilePictureUrl: (profilePictureUrl: string | null) => void;

    oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null;
    setOldProfilePicture: (oldProfile: {
        public_id: string;
        resource_type: string;
        url: string;
    } | null) => void;

    roomCode: string;
    setRoomCode: (roomCode: string) => void;

    username: string;
    setUserName: (username: string) => void;
}