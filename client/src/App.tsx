import AvailableGroup from "./group_profiles/AvailableGroup";
import Chatbot from "./chatbot/Chatbot";
import CreateGroup from "./group_profiles/CreateGroup";
import Home from "./user_profiles/Home";
import JoinGroup from "./group_member/JoinGroup";
import RoomMediaDetail from "./pages/RoomMediaDetail";
import RoomMediaPreview from "./pages/RoomMediaPreview";
import ProtectedRoute from "./auths/ProtectedRoute";
import GroupChat from "./group_chats/GroupChat";
import GroupMember from "./group_member/GroupMember";
import GroupDetail from "./group_profiles/GroupDetail";
import SignIn from "./auths/SignIn";
import SignUp from "./auths/SignUp";
import UserChat from "./user_chats/UserChat";
import UserMediaDetail from "./user_chats/UserMediaDetail";
import UserMediaPreview from "./user_chats/UserMediaPreview";
import UserProfile from "./user_profiles/UserProfile";
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
                    <Route element={<ProtectedRoute><AvailableGroup/></ProtectedRoute>} path="/rooms"/>
                    <Route element={<ProtectedRoute><CreateGroup/></ProtectedRoute>} path="/rooms/create"/>
                    <Route element={<ProtectedRoute><JoinGroup/></ProtectedRoute>} path="/rooms/join"/>
                    <Route element={<ProtectedRoute><GroupChat/></ProtectedRoute>} path="/rooms/chat/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaPreview/></ProtectedRoute>} path="/room/chat/preview/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaDetail/></ProtectedRoute>} path="/room/media/detail/:chat_id"/>
                    <Route element={<ProtectedRoute><GroupDetail/></ProtectedRoute>} path="/rooms/profile/:room_id"/>
                    <Route element={<ProtectedRoute><GroupMember/></ProtectedRoute>} path="/rooms/member/:room_id"/>
                    <Route element={<ProtectedRoute><Chatbot/></ProtectedRoute>} path="/chatbot"/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}