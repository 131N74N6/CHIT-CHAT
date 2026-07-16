import { useQuery } from '@tanstack/react-query';
import type { IUserProfileService, UserProfileIntrf } from '../models/user.model';

export default function userProfileService(props?: IUserProfileService) {
    const { data: detail, error: detailError, isLoading: isDetailLoading } = useQuery<UserProfileIntrf>({
        enabled: !!props?.receiverId,
        queryFn: async () => {
            try {
                const request = await fetch(`${import.meta.env.VITE_BASE_API_URL}/chats/profile/${props?.receiverId}`);

                const response = await request.json();
                if (!request.ok) throw new Error(response.message);
                return response;
            } catch (error) {
                throw error;
            }
        },
        queryKey: [`user-${props?.receiverId}`],
        staleTime: Infinity
    });

    const currentUserProfile = { detail, detailError, isDetailLoading }

    return { currentUserProfile }
}