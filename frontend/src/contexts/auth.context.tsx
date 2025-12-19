import { createContext, useContext } from 'react';
import type {
  User,
  UserRole,
} from 'skill-stream-backend/shared/types';

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const AuthContext = createContext<
  AuthContextType | undefined
>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthProvider',
    );
  }
  return context;
};
