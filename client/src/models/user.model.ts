import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from "@tanstack/react-query";

export interface IAuthService {
    setMessage?: (message: string | null) => void;
}

export interface IUserService extends IAuthService {
    roomId?: string;
}

export interface UserProfileIntrf {
    address: string;
    email: string;
    gender: string;
    profile_pic: {
        public_id: string;
        resource_type: string;
        url: string;
    }
    user_id: string;
    username: string;
}

export interface UserIntrf {
    _id: string;
    profile_pic: {
        public_id: string;
        resource_type: string;
        url: string;
    };
    username: string;
}

export interface UserListIntrf {
    users: UserIntrf[];
    fetchNextUser: (options?: FetchNextPageOptions | undefined) => Promise<InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}

export interface UserItemIntrf {
    user: UserIntrf;
}