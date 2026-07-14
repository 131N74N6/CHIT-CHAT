import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Join from "./pages/Join";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import UserChat from "./pages/UserChat";
import RoomChat from "./pages/RoomChat";
import AvailableRoom from "./pages/AvailableRoom";
import UserProfile from "./pages/UserProfile";
import Chatbot from "./pages/Chatbot";
import ChatbotResults from "./pages/ChatbotResults";
import ChatbotDetail from "./pages/ChatbotDetail";
import YourProfile from "./pages/YourProfile";
import MediaPreview from "./pages/MediaPreview";
import MediaDetail from "./pages/MediaDetail";

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
                    <Route element={<ProtectedRoute><Join/></ProtectedRoute>} path="/join-room"/>
                    <Route element={<ProtectedRoute><Home/></ProtectedRoute>} path="/home"/>
                    <Route element={<ProtectedRoute><YourProfile/></ProtectedRoute>} path="/profile"/>
                    <Route element={<ProtectedRoute><UserChat/></ProtectedRoute>} path="/user/chat/:receiver_id"/>
                    <Route element={<ProtectedRoute><UserProfile/></ProtectedRoute>} path="/user/profile/:receiver_id"/>
                    <Route element={<ProtectedRoute><AvailableRoom/></ProtectedRoute>} path="/rooms"/>
                    <Route element={<ProtectedRoute><RoomChat/></ProtectedRoute>} path="/rooms/chat/:room_id"/>
                    <Route element={<ProtectedRoute><RoomChat/></ProtectedRoute>} path="/rooms/profile/:room_id"/>
                    <Route element={<ProtectedRoute><Chatbot/></ProtectedRoute>} path="/chatbot"/>
                    <Route element={<ProtectedRoute><ChatbotResults/></ProtectedRoute>} path="/chatbot/histories"/>
                    <Route element={<ProtectedRoute><ChatbotDetail/></ProtectedRoute>} path="/chatbot/detail/:_id"/>
                    <Route element={<ProtectedRoute><MediaPreview/></ProtectedRoute>} path="/media/preview"/>
                    <Route element={<ProtectedRoute><MediaDetail/></ProtectedRoute>} path="/media/detail"/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}