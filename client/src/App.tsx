import AvailableRoom from "./pages/AvailableRoom";
import ChangeRoom from "./pages/ChangeRoom";
import ChangeUser from "./pages/ChangeUser";
import Chatbot from "./pages/Chatbot";
import ChatbotDetail from "./pages/ChatbotDetail";
import ChatbotResults from "./pages/ChatbotResults";
import CreateRoom from "./pages/CreateRoom";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import RoomMediaDetail from "./pages/RoomMediaDetail";
import RoomMediaPreview from "./pages/RoomMediaPreview";
import ProtectedRoute from "./components/ProtectedRoute";
import RoomChat from "./pages/RoomChat";
import RoomMember from "./pages/RoomMember";
import RoomProfile from "./pages/RoomProfile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import UserChat from "./pages/UserChat";
import UserMediaDetail from "./pages/UserMediaDetail";
import UserMediaPreview from "./pages/UserMediaPreview";
import UserProfile from "./pages/UserProfile";
import YourProfile from "./pages/YourProfile";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<SignIn/>} path="/sign-in"/>
                    <Route element={<SignUp/>} path="/sign-up"/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route element={<ProtectedRoute><JoinRoom/></ProtectedRoute>} path="/join-room"/>
                    <Route element={<ProtectedRoute><Home/></ProtectedRoute>} path="/home"/>
                    <Route element={<ProtectedRoute><YourProfile/></ProtectedRoute>} path="/profile"/>
                    <Route element={<ProtectedRoute><ChangeUser/></ProtectedRoute>} path="/profile/edit"/>
                    <Route element={<ProtectedRoute><UserChat/></ProtectedRoute>} path="/user/chat/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserMediaPreview/></ProtectedRoute>} path="/user/chat/preview/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserMediaDetail/></ProtectedRoute>} path="/user/media/detail/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserProfile/></ProtectedRoute>} path="/user/profile/:receiver_id"/>
                    <Route element={<ProtectedRoute><AvailableRoom/></ProtectedRoute>} path="/rooms"/>
                    <Route element={<ProtectedRoute><CreateRoom/></ProtectedRoute>} path="/rooms/create"/>
                    <Route element={<ProtectedRoute><ChangeRoom/></ProtectedRoute>} path="/rooms/edit/:room_id"/>
                    <Route element={<ProtectedRoute><RoomChat/></ProtectedRoute>} path="/rooms/chat/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaPreview/></ProtectedRoute>} path="/room/chat/preview/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMediaDetail/></ProtectedRoute>} path="/room/media/detail/:room_id"/>
                    <Route element={<ProtectedRoute><RoomProfile/></ProtectedRoute>} path="/rooms/profile/:room_id"/>
                    <Route element={<ProtectedRoute><RoomMember/></ProtectedRoute>} path="/rooms/profile/:room_id"/>
                    <Route element={<ProtectedRoute><Chatbot/></ProtectedRoute>} path="/chatbot"/>
                    <Route element={<ProtectedRoute><ChatbotResults/></ProtectedRoute>} path="/chatbot/histories"/>
                    <Route element={<ProtectedRoute><ChatbotDetail/></ProtectedRoute>} path="/chatbot/detail/:_id"/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}