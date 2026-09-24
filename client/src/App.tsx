import AvailableRoom from "./pages/AvailableRoom";
import Chatbot from "./pages/Chatbot";
import CreateRoom from "./pages/CreateRoom";
import Home from "./user_chats/Home";
import JoinRoom from "./pages/JoinRoom";
import RoomMediaDetail from "./pages/RoomMediaDetail";
import RoomMediaPreview from "./pages/RoomMediaPreview";
import ProtectedRoute from "./components/ProtectedRoute";
import RoomChat from "./pages/RoomChat";
import RoomMember from "./pages/RoomMember";
import RoomProfile from "./pages/RoomProfile";
import SignIn from "./auths/SignIn";
import SignUp from "./auths/SignUp";
import UserChat from "./user_chats/UserChat";
import UserMediaDetail from "./user_chats/UserMediaDetail";
import UserMediaPreview from "./user_chats/UserMediaPreview";
import UserProfile from "./pages/UserProfile";
import YourProfile from "./auths/YourProfile";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false
        }
    }
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route element={<SignIn/>} path="/sign-in"/>
                    <Route element={<SignUp/>} path="/sign-up"/>
                    <Route element={<ProtectedRoute><Home/></ProtectedRoute>} path="/home"/>
                    <Route element={<ProtectedRoute><YourProfile/></ProtectedRoute>} path="/profile"/>
                    <Route element={<ProtectedRoute><UserChat/></ProtectedRoute>} path="/user/chat/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserMediaPreview/></ProtectedRoute>} path="/user/chat/preview/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserMediaDetail/></ProtectedRoute>} path="/user/media/detail/:chat_id"/>
                    <Route element={<ProtectedRoute><UserProfile/></ProtectedRoute>} path="/user/profile/:receiver_id"/>
                    <Route element={<ProtectedRoute><AvailableRoom/></ProtectedRoute>} path="/rooms"/>
                    <Route element={<ProtectedRoute><CreateRoom/></ProtectedRoute>} path="/rooms/create"/>
                    <Route element={<ProtectedRoute><JoinRoom/></ProtectedRoute>} path="/rooms/join"/>
                    <Route element={<ProtectedRoute><RoomChat/></ProtectedRoute>} path="/rooms/chat/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaPreview/></ProtectedRoute>} path="/room/chat/preview/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaDetail/></ProtectedRoute>} path="/room/media/detail/:chat_id"/>
                    <Route element={<ProtectedRoute><RoomProfile/></ProtectedRoute>} path="/rooms/profile/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMember/></ProtectedRoute>} path="/rooms/member/:room_id"/>
                    <Route element={<ProtectedRoute><Chatbot/></ProtectedRoute>} path="/chatbot"/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}