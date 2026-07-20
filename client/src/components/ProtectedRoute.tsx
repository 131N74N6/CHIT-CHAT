import { Navigate } from "react-router-dom";
import useUserService from "../services/useUserProfileService";
import Loading from "./Loading";

interface ProtectedRouteIntrf {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteIntrf) {
    const { currentUser } = useUserService();

    if (!currentUser.user && currentUser.isUserLoading) {
        return (
            <div className="bg-white flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return currentUser.user && currentUser.user.user_id ? <>{props.children}</> : <Navigate to={"/sign-in"} replace/>
}