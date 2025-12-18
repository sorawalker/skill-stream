import { Link, useNavigate } from 'react-router-dom';
import './ErrorPage.scss';

interface UnauthorizedErrorProps {
  message?: string;
  showBackButton?: boolean;
}

export const UnauthorizedError = ({
  message = 'You need to be logged in to access this resource.',
  showBackButton = true,
}: UnauthorizedErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <div className="error-page__icon">🔒</div>
          <h1 className="error-page__title">401 - Unauthorized</h1>
          <p className="error-page__message">{message}</p>
          <div className="error-page__actions">
            <Link to="/login" className="error-page__button error-page__button--primary">
              Go to Login
            </Link>
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="error-page__button error-page__button--secondary"
              >
                Go Back
              </button>
            )}
            <Link to="/" className="error-page__button error-page__button--secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};



