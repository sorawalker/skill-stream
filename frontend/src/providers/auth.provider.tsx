import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from '../contexts/auth.context';
import type {
  User,
  UserRole,
} from 'skill-stream-backend/shared/types';
import { usersService } from '../services/users.service';
import { isTokenExpired } from '../utils/api';

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [token, setTokenState] = useState<string | null>(
    () => {
      const storedToken = localStorage.getItem(
        TOKEN_STORAGE_KEY,
      );
      if (storedToken && isTokenExpired(storedToken)) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
        return null;
      }
      return storedToken;
    },
  );

  const [user, setUserState] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(
      USER_STORAGE_KEY,
    );
    if (storedUser && token && !isTokenExpired(token)) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
    setTokenState(newToken);
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(newUser),
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
    setUserState(newUser);
  };

  const hasRole = (
    role: UserRole | UserRole[],
  ): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        setToken(null);
        setUser(null);
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
      }
    };

    checkTokenExpiration();

    const interval = setInterval(
      checkTokenExpiration,
      60000,
    );

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleTokenExpired = () => {
      setToken(null);
      setUser(null);
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register'
      ) {
        window.location.href = '/login';
      }
    };

    window.addEventListener(
      'auth:token-expired',
      handleTokenExpired,
    );

    return () => {
      window.removeEventListener(
        'auth:token-expired',
        handleTokenExpired,
      );
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user && !isTokenExpired(token)) {
        try {
          const tokenData = JSON.parse(
            atob(token.split('.')[1]),
          );
          const userId = parseInt(tokenData.sub);
          const fetchedUser =
            await usersService.findOne(userId);
          setUser(fetchedUser);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            error.status === 401
          ) {
            setToken(null);
            setUser(null);
          }
        }
      }
    };

    fetchUser();
  }, [token, user]);

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    user,
    setUser,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
