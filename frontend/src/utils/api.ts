const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiError extends Error {
  status: number;
  data?: unknown;
}

export function createApiError(
  status: number,
  message: string,
  data?: unknown,
): ApiError {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  error.data = data;
  return error;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isTokenExpired = (
  token: string | null,
): boolean => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;

    return Date.now() >= exp * 1000 - 5000;
  } catch {
    return true;
  }
};

const handleTokenExpiration = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  window.dispatchEvent(
    new CustomEvent('auth:token-expired'),
  );
};

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  if (token && isTokenExpired(token)) {
    handleTokenExpiration();
    throw createApiError(401, 'Token expired');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized (expired/invalid token)
    if (response.status === 401) {
      handleTokenExpiration();
    }

    let errorMessage = 'An error occurred';
    let errorData: unknown;

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message || errorMessage;
      errorData = errorBody;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw createApiError(
      response.status,
      errorMessage,
      errorData,
    );
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
