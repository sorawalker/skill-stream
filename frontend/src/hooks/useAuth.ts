import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService, type SignInRequest, type RegisterRequest } from '../services/auth.service';
import { useAuthContext } from '../contexts/auth.context';

export const useAuth = () => {
  const { setToken, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: (credentials: SignInRequest) => authService.signIn(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries();
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authService.register(userData),
    onSuccess: () => {
      navigate('/login');
    },
  });

  const signOut = () => {
    setToken(null);
    queryClient.clear();
    navigate('/login');
  };

  return {
    signIn: signInMutation.mutate,
    signInAsync: signInMutation.mutateAsync,
    isSigningIn: signInMutation.isPending,
    signInError: signInMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    signOut,
    isAuthenticated,
  };
};

