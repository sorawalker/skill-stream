import { useState } from 'react';
import { usersService } from '../../services/users.service';
import './ChangePasswordModal.scss';

interface ChangePasswordModalProps {
  userId: number | undefined;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  userId,
  onClose,
}: ChangePasswordModalProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    setError('');

    if (!newPassword) {
      setError('Password is required');
      return false;
    }

    if (newPassword.length < 8 || newPassword.length > 32) {
      setError('Password must be between 8 and 32 characters');
      return false;
    }

    if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)
    ) {
      setError(
        'Password must contain uppercase, lowercase, number and special character',
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !userId) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await usersService.changePassword(userId, newPassword);
      alert('Password changed successfully!');
      onClose();
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-modal__overlay" onClick={onClose}>
      <div
        className="change-password-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="change-password-modal__header">
          <h2 className="change-password-modal__title">Change Password</h2>
          <button
            className="change-password-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="change-password-modal__form">
          <div className="change-password-modal__field">
            <label
              htmlFor="newPassword"
              className="change-password-modal__label"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              className="change-password-modal__input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          <div className="change-password-modal__field">
            <label
              htmlFor="confirmPassword"
              className="change-password-modal__label"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="change-password-modal__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="change-password-modal__error">{error}</div>
          )}

          <div className="change-password-modal__actions">
            <button
              type="button"
              className="change-password-modal__button change-password-modal__button--secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="change-password-modal__button change-password-modal__button--primary"
              disabled={isLoading}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

