export interface IChatService {
    receiverId?: string;
    roomId?: string;
    setMessage?: (message:  string | null) => void;
}