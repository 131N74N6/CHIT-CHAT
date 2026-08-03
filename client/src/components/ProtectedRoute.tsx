import { Navigate } from "react-router-dom";
import useUserService from "../services/useUserProfileService";
import Loading from "./Loading";

interface ProtectedRouteIntrf {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteIntrf) {
    const { currentUser } = useUserService();

    if (!currentUser.data && currentUser.isLoading) {
        return (
            <div className="bg-white flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return currentUser.data && currentUser.data.user_id ? <>{props.children}</> : <Navigate to={"/sign-in"} replace/>
}