import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import type { IProtectedRouteProps } from "../../types/types";
import SkeletonLoading from "./Skeleton";

const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SkeletonLoading/>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
