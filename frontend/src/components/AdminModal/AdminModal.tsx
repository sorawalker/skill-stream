import type { ReactNode } from 'react';
import './AdminModal.scss';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const AdminModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
}: AdminModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="admin-modal" onClick={onClose}>
      <div
        className={`admin-modal__content admin-modal__content--${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
};
