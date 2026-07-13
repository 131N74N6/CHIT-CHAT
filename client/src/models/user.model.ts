export interface IAuthService {
    setMessage?: (message: string | null) => void;
}

export interface IUserService extends IAuthService {
    roomId?: string;
}

export interface UserIntrf {
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