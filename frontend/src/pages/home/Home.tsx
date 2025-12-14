import { useAuth } from '../../hooks/useAuth.ts';
import './Home.scss';

export const Home = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <div className="home-page">
      <div className="home-page__container">
        <h1 className="home-page__title">Skill Stream</h1>
        {isAuthenticated ? (
          <div className="home-page__content">
            <p>Welcome to Skill Stream!</p>
            <button onClick={signOut} className="home-page__sign-out">
              Sign Out
            </button>
          </div>
        ) : (
          <p>Please sign in to continue</p>
        )}
      </div>
    </div>
  );
};

