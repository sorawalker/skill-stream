import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './LoginForm.scss';

export const LoginForm = () => {
  const { signIn, isSigningIn, signInError } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    login?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: { login?: string; password?: string } =
      {};

    if (!login.trim()) {
      newErrors.login = 'Login is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    signIn({ login, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__field">
        <label
          htmlFor="login"
          className="login-form__label"
        >
          Login (Email or Name)
        </label>
        <input
          id="login"
          type="text"
          className="login-form__input"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          disabled={isSigningIn}
        />
        {errors.login && (
          <span className="login-form__error">
            {errors.login}
          </span>
        )}
      </div>

      <div className="login-form__field">
        <label
          htmlFor="password"
          className="login-form__label"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="login-form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSigningIn}
        />
        {errors.password && (
          <span className="login-form__error">
            {errors.password}
          </span>
        )}
      </div>

      {signInError && (
        <div className="login-form__error-message">
          {signInError.message}
        </div>
      )}

      <button
        type="submit"
        className="login-form__submit"
        disabled={isSigningIn}
      >
        {isSigningIn ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};
