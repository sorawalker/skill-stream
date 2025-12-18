import { Link, useNavigate } from 'react-router-dom';
import './ErrorPage.scss';

interface NotFoundErrorProps {
  message?: string;
  resource?: string;
  showBackButton?: boolean;
}

export const NotFoundError = ({
  message,
  resource = 'Resource',
  showBackButton = true,
}: NotFoundErrorProps) => {
  const navigate = useNavigate();
  const displayMessage = message || `${resource} not found.`;

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <div className="error-page__icon">🔍</div>
          <h1 className="error-page__title">404 - Not Found</h1>
          <p className="error-page__message">{displayMessage}</p>
          <div className="error-page__actions">
            {showBackButton && (
              <button
                onClick={() => navigate(-1)}
                className="error-page__button error-page__button--primary"
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



