export interface IAuthService {
    message?: string | null;
    setMessage?: (message: string | null) => void;
}

export interface IUserService extends IAuthService {}