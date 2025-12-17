import type { ReactNode } from 'react';
import type { ApiError } from '../../utils/api';
import {
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
  GenericError,
} from './index';

interface ApiErrorHandlerProps {
  error: ApiError | Error;
  children?: ReactNode;
  customMessages?: {
    401?: string;
    403?: string;
    404?: string;
    500?: string;
    default?: string;
  };
  showBackButton?: boolean;
}

export const ApiErrorHandler = ({
  error,
  children,
  customMessages = {},
  showBackButton = true,
}: ApiErrorHandlerProps) => {
  const apiError = error as ApiError;
  const status = apiError.status;
  const message = apiError.message || customMessages.default || 'An error occurred';

  if (status === 401) {
    return (
      <UnauthorizedError
        message={customMessages[401] || message}
        showBackButton={showBackButton}
      />
    );
  }

  if (status === 403) {
    return (
      <ForbiddenError
        message={customMessages[403] || message}
        showBackButton={showBackButton}
      />
    );
  }

  if (status === 404) {
    return (
      <NotFoundError
        message={customMessages[404] || message}
        showBackButton={showBackButton}
      />
    );
  }

  if (status >= 500) {
    return (
      <ServerError
        message={customMessages[500] || message}
        showBackButton={showBackButton}
      />
    );
  }

  if (status) {
    return (
      <GenericError
        status={status}
        message={message}
        showBackButton={showBackButton}
      />
    );
  }

  return children ? (
    <>{children}</>
  ) : (
    <GenericError message={message} showBackButton={showBackButton} />
  );
};


