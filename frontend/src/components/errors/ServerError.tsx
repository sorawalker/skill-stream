import { Link, useNavigate } from 'react-router-dom';
import './ErrorPage.scss';

interface ServerErrorProps {
  message?: string;
  showBackButton?: boolean;
}

export const ServerError = ({
  message = 'An internal server error occurred. Please try again later.',
  showBackButton = true,
}: ServerErrorProps) => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <div className="error-page__icon">⚠️</div>
          <h1 className="error-page__title">500 - Server Error</h1>
          <p className="error-page__message">{message}</p>
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

