import { useLocation, Navigate } from "react-router";
import { useAuth } from "../../hook/useAuth";
import type { IProtectedRouteProps } from "../../types/types";




const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-xl font-bold">Loading...</div>;
    }

    if (!user) {
      
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;