import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth.context';
import { useAuth } from '../../hooks/useAuth';

export const AdminLayout = () => {
  const location = useLocation();
  const { user, hasRole } = useAuthContext();
  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <nav>
        <div>
          <h1>Admin Panel</h1>
          <p>Welcome, {user?.name}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
        <ul>
          {hasRole('ADMIN') && (
            <li>
              <Link to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
                Users
              </Link>
            </li>
          )}
          {(hasRole('ADMIN') || hasRole('MANAGER')) && (
            <>
              <li>
                <Link to="/admin/courses" className={isActive('/admin/courses') ? 'active' : ''}>
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/admin/lessons" className={isActive('/admin/lessons') ? 'active' : ''}>
                  Lessons
                </Link>
              </li>
              <li>
                <Link to="/admin/quizzes" className={isActive('/admin/quizzes') ? 'active' : ''}>
                  Quizzes
                </Link>
              </li>
              <li>
                <Link to="/admin/enrollments" className={isActive('/admin/enrollments') ? 'active' : ''}>
                  Enrollments
                </Link>
              </li>
              <li>
                <Link to="/admin/progress" className={isActive('/admin/progress') ? 'active' : ''}>
                  Progress
                </Link>
              </li>
              <li>
                <Link to="/admin/quiz-attempts" className={isActive('/admin/quiz-attempts') ? 'active' : ''}>
                  Quiz Attempts
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

