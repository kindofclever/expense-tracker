import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath,
  element,
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{element}</>;
};

export default ProtectedRoute;
