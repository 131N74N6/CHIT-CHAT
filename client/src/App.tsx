import AvailableGroup from "./group_profiles/AvailableGroup";
import Chatbot from "./chatbot/Chatbot";
import CreateGroup from "./group_profiles/CreateGroup";
import Home from "./user_profiles/Home";
import JoinGroup from "./group_member/JoinGroup";
import ProtectedRoute from "./auths/ProtectedRoute";
import SignIn from "./auths/SignIn";
import SignUp from "./auths/SignUp";
import UserProfile from "./user_profiles/UserProfile";
import YourProfile from "./auths/YourProfile";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Settings from "./settings/Settings";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace/>}/>
                    <Route element={<SignIn/>} path="/sign-in"/>
                    <Route element={<SignUp/>} path="/sign-up"/>
                    <Route element={<ProtectedRoute><Home/></ProtectedRoute>} path="/home"/>
                    <Route element={<ProtectedRoute><Settings/></ProtectedRoute>} path="/settings"/>
                    <Route element={<ProtectedRoute><YourProfile/></ProtectedRoute>} path="/profile"/>
                    <Route element={<ProtectedRoute><UserProfile/></ProtectedRoute>} path="/user/profile/:receiver_id"/>
                    <Route element={<ProtectedRoute><AvailableGroup/></ProtectedRoute>} path="/rooms"/>
                    <Route element={<ProtectedRoute><CreateGroup/></ProtectedRoute>} path="/rooms/create"/>
                    <Route element={<ProtectedRoute><JoinGroup/></ProtectedRoute>} path="/rooms/join"/>
                    <Route element={<ProtectedRoute><Chatbot/></ProtectedRoute>} path="/chatbot"/>
                    <Route path="*" element={<Navigate to="/sign-in" replace/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}