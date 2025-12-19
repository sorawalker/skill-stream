import { useState, type FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './RegisterForm.scss';

export const RegisterForm = () => {
  const { register, isRegistering, registerError } =
    useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      email?: string;
      name?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.length < 8 || name.length > 16) {
      newErrors.name =
        'Name must be between 8 and 16 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (
      password.length < 8 ||
      password.length > 32
    ) {
      newErrors.password =
        'Password must be between 8 and 32 characters';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        password,
      )
    ) {
      newErrors.password =
        'Password must contain uppercase, lowercase, number and special character';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    register({ email, name, password });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form__field">
        <label
          htmlFor="email"
          className="register-form__label"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          className="register-form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isRegistering}
        />
        {errors.email && (
          <span className="register-form__error">
            {errors.email}
          </span>
        )}
      </div>

      <div className="register-form__field">
        <label
          htmlFor="name"
          className="register-form__label"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          className="register-form__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isRegistering}
          minLength={8}
          maxLength={16}
        />
        {errors.name && (
          <span className="register-form__error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="register-form__field">
        <label
          htmlFor="password"
          className="register-form__label"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="register-form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isRegistering}
          maxLength={32}
        />
        {errors.password && (
          <span className="register-form__error">
            {errors.password}
          </span>
        )}
      </div>

      <div className="register-form__field">
        <label
          htmlFor="confirmPassword"
          className="register-form__label"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="register-form__input"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          disabled={isRegistering}
          maxLength={32}
        />
        {errors.confirmPassword && (
          <span className="register-form__error">
            {errors.confirmPassword}
          </span>
        )}
      </div>

      {registerError && (
        <div className="register-form__error-message">
          {registerError.message}
        </div>
      )}

      <button
        type="submit"
        className="register-form__submit"
        disabled={isRegistering}
      >
        {isRegistering ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};
