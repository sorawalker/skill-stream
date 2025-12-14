import type { User } from './user.types';
import type { Course } from './course.types';
import type { FindManyUsersDto } from '../../users/dto/find-many-user.dto';
import type { FindManyCoursesDto } from '../../courses/dto/find-many-courses.dto';

// User API responses
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

// Course API responses
export type CreateCourseResponse = Course;

export interface FindManyCoursesResponse {
  data: Course[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type FindOneCourseResponse = Course;

export type UpdateCourseResponse = Course;

export type DeleteCourseResponse = Course;

export type FindManyCoursesRequest = FindManyCoursesDto;
