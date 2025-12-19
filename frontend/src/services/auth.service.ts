import { api } from '../utils/api.ts';
import type {
  SignInRequest,
  SignInResponse,
  RegisterRequest,
  CreateUserResponse,
} from 'skill-stream-backend/shared/types';

export type {
  SignInRequest,
  SignInResponse,
  RegisterRequest,
  CreateUserResponse,
};

export const authService = {
  signIn: async (
    credentials: SignInRequest,
  ): Promise<SignInResponse> => {
    return api.post<SignInResponse>(
      '/auth/sign-in',
      credentials,
    );
  },

  register: async (
    userData: RegisterRequest,
  ): Promise<CreateUserResponse> => {
    return api.post<CreateUserResponse>(
      '/auth/sign-up',
      userData,
    );
  },
};
