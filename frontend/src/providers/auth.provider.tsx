import { useState, type ReactNode } from 'react';
import { AuthContext } from '../contexts/auth.context';

const TOKEN_STORAGE_KEY = 'auth_token';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    setTokenState(newToken);
  };

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

