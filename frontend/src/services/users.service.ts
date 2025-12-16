import { api } from '../utils/api';
import type {
  CreateUserResponse,
  FindManyUsersResponse,
  FindOneUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  FindManyUsersRequest,
} from 'skill-stream-backend/shared/types';

export const usersService = {
  create: async (userData: {
    email: string;
    name: string;
    password: string;
  }): Promise<CreateUserResponse> => {
    return api.post<CreateUserResponse>('/users', userData);
  },

  findMany: async (
    params?: FindManyUsersRequest,
  ): Promise<FindManyUsersResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    return api.get<FindManyUsersResponse>(
      `/users${query ? `?${query}` : ''}`,
    );
  },

  findOne: async (identifier: string | number): Promise<FindOneUserResponse> => {
    return api.get<FindOneUserResponse>(`/users/${identifier}`);
  },

  update: async (
    id: number,
    userData: Partial<{ email: string; name: string; password: string }>,
  ): Promise<UpdateUserResponse> => {
    return api.patch<UpdateUserResponse>(`/users/${id}`, userData);
  },

  delete: async (id: number): Promise<DeleteUserResponse> => {
    return api.delete<DeleteUserResponse>(`/users/${id}`);
  },
};

