import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm/LoginForm.tsx';
import './Login.scss';

export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-page__container">
        <h1 className="login-page__title">Sign In</h1>
        <LoginForm />
        <p className="login-page__footer">
          Don't have an account?{' '}
          <Link to="/register" className="login-page__link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
