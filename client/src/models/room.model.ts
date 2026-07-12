export interface IRoomService {
    receiverId?: string;
    roomId?: string;
    setMessage?: (message:  string | null) => void;
}