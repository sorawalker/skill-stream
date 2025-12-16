import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth.context';
import type { UserRole } from 'skill-stream-backend/shared/types';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole | UserRole[];
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

