import { Navigate } from "react-router-dom";
import useUserServices from "../services/useUserServices";
import Loading from "./Loading";

interface ProtectedRouteIntrf {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteIntrf) {
    const { currentUser } = useUserServices();

    if (!currentUser.user && currentUser.isUserLoading) {
        return (
            <div className="bg-white flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return currentUser.user && currentUser.user.user_id ? <>{props.children}</> : <Navigate to={"/sign-in"} replace/>
}