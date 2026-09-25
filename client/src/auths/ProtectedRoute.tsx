import { Navigate } from "react-router-dom";
import Loading from "../components/Loading";
import useAuthService from "./service";

interface ProtectedRouteIntrf {
    children: React.ReactNode;
}

export default function ProtectedRoute(props: ProtectedRouteIntrf) {
    const auths = useAuthService();

    if (!auths.getCurrentUser.data && auths.getCurrentUser.isLoading) {
        return (
            <div className="bg-white flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    return auths.getCurrentUser.data && auths.getCurrentUser.data.user_id ? 
    <>{props.children}</> : <Navigate to={"/sign-in"} replace/>;
}