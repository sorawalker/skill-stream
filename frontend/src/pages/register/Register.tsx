import { Link } from 'react-router-dom';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm.tsx';
import './Register.scss';

export const Register = () => {
  return (
    <div className="register-page">
      <div className="register-page__container">
        <h1 className="register-page__title">Register</h1>
        <RegisterForm />
        <p className="register-page__footer">
          Already have an account?{' '}
          <Link to="/login" className="register-page__link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
