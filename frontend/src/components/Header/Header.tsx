import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/auth.context';
import { useAuth } from '../../hooks/useAuth';
import { ChangePasswordModal } from '../ChangePasswordModal/ChangePasswordModal';
import './Header.scss';

export const Header = () => {
  const { isAuthenticated, user, hasRole } = useAuthContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleSignOut = () => {
    signOut();
    setIsProfileOpen(false);
    navigate('/login');
  };

  const isAdmin = hasRole(['ADMIN', 'MANAGER']);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <img src="/logo.png" alt="Skill Stream" className="header__logo-image" />
            <span className="header__logo-text">Skill Stream</span>
          </Link>

          <nav className="header__nav">
            <Link to="/my-courses" className="header__nav-link">
              My Courses
            </Link>

            {isAdmin && (
              <Link to="/admin" className="header__nav-link header__nav-link--admin">
                Admin Panel
              </Link>
            )}

            <Link to="/about" className="header__nav-link header__nav-link--about">
              About the Author
            </Link>

            <div className="header__profile" ref={profileRef}>
              <button
                className="header__profile-button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                aria-label="Profile menu"
              >
                <div className="header__profile-avatar">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="header__profile-name">{user?.name}</span>
                <span className="header__profile-arrow">
                  {isProfileOpen ? '▲' : '▼'}
                </span>
              </button>

              {isProfileOpen && (
                <div className="header__profile-menu">
                  <div className="header__profile-info">
                    <div className="header__profile-email">{user?.email}</div>
                    <div className="header__profile-role">{user?.role}</div>
                  </div>
                  <div className="header__profile-divider"></div>
                  <button
                    className="header__profile-menu-item"
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                  >
                    Change Password
                  </button>
                  <button
                    className="header__profile-menu-item header__profile-menu-item--danger"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          userId={user?.id}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </>
  );
};

