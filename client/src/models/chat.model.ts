export interface IChatService {
    message?:  string | null;
    receiverId?: string;
    roomId?: string;
    setMessage?: (message:  string | null) => void;
}