import { api } from '../utils/api';
import type {
  CreateCourseResponse,
  FindManyCoursesResponse,
  FindOneCourseResponse,
  UpdateCourseResponse,
  DeleteCourseResponse,
  FindManyCoursesRequest,
} from 'skill-stream-backend/shared/types';

export const coursesService = {
  create: async (courseData: {
    title: string;
    description: string;
    image: string;
  }): Promise<CreateCourseResponse> => {
    return api.post<CreateCourseResponse>('/courses', courseData);
  },

  findMany: async (params?: FindManyCoursesRequest): Promise<FindManyCoursesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    return api.get<FindManyCoursesResponse>(`/courses${query ? `?${query}` : ''}`);
  },

  findOne: async (id: number): Promise<FindOneCourseResponse> => {
    return api.get<FindOneCourseResponse>(`/courses/${id}`);
  },

  update: async (
    id: number,
    courseData: Partial<{
      title: string;
      description: string;
      image: string;
    }>,
  ): Promise<UpdateCourseResponse> => {
    return api.patch<UpdateCourseResponse>(`/courses/${id}`, courseData);
  },

  delete: async (id: number): Promise<DeleteCourseResponse> => {
    return api.delete<DeleteCourseResponse>(`/courses/${id}`);
  },
};
