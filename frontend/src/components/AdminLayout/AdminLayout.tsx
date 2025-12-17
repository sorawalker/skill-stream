import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth.context';
import { useAuth } from '../../hooks/useAuth';
import './AdminLayout.scss';

export const AdminLayout = () => {
  const location = useLocation();
  const { isAuthenticated, user, hasRole } = useAuthContext();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(['ADMIN', 'MANAGER'])) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__header">
          <h1 className="admin-layout__title">Admin Panel</h1>
          <div className="admin-layout__user-info">
            <span className="admin-layout__user-name">Welcome, {user?.name}</span>
          </div>
          <button className="admin-layout__sign-out" onClick={signOut}>
            Sign Out
          </button>
        </div>
        <nav className="admin-layout__nav">
          <ul className="admin-layout__nav-list">
            <li className="admin-layout__nav-item">
              <Link
                to="/admin"
                className={`admin-layout__nav-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            {hasRole('ADMIN') && (
              <li className="admin-layout__nav-item">
                <Link
                  to="/admin/users"
                  className={`admin-layout__nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  Users
                </Link>
              </li>
            )}
            {(hasRole('ADMIN') || hasRole('MANAGER')) && (
              <>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/courses"
                    className={`admin-layout__nav-link ${isActive('/admin/courses') ? 'active' : ''}`}
                  >
                    Courses
                  </Link>
                </li>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/lessons"
                    className={`admin-layout__nav-link ${isActive('/admin/lessons') ? 'active' : ''}`}
                  >
                    Lessons
                  </Link>
                </li>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/quizzes"
                    className={`admin-layout__nav-link ${isActive('/admin/quizzes') ? 'active' : ''}`}
                  >
                    Quizzes
                  </Link>
                </li>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/enrollments"
                    className={`admin-layout__nav-link ${isActive('/admin/enrollments') ? 'active' : ''}`}
                  >
                    Enrollments
                  </Link>
                </li>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/progress"
                    className={`admin-layout__nav-link ${isActive('/admin/progress') ? 'active' : ''}`}
                  >
                    Progress
                  </Link>
                </li>
                <li className="admin-layout__nav-item">
                  <Link
                    to="/admin/quiz-attempts"
                    className={`admin-layout__nav-link ${isActive('/admin/quiz-attempts') ? 'active' : ''}`}
                  >
                    Quiz Attempts
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
};

