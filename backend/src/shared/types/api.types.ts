import type { User } from './user.types';
import type { FindManyUsersDto } from '../../users/dto/find-many-user.dto';

export type CreateUserResponse = User;

export interface FindManyUsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneUserResponse = User;

export type UpdateUserResponse = User;

export type DeleteUserResponse = User;

export type FindManyUsersRequest = FindManyUsersDto;
