import { FC } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to='/login' state={{ from: location }} replace />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
