import { Navigate, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  isAuthenticated: boolean;
  redirectPath: string;
  element: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  isAuthenticated,
  redirectPath,
  element,
}) => {
  const location = useLocation();

  if (isAuthenticated) {
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

export default PublicRoute;
