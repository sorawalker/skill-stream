import { api } from '../utils/api';
import type {
  CreateLessonResponse,
  FindManyLessonsResponse,
  FindOneLessonResponse,
  UpdateLessonResponse,
  DeleteLessonResponse,
  FindManyLessonsRequest,
} from 'skill-stream-backend/shared/types';

export const lessonsService = {
  create: async (
    courseId: number,
    lessonData: {
      title: string;
      content: string;
      order: number;
    },
  ): Promise<CreateLessonResponse> => {
    return api.post<CreateLessonResponse>(
      `/courses/${courseId}/lessons`,
      lessonData,
    );
  },

  findManyByCourse: async (
    courseId: number,
    params?: FindManyLessonsRequest,
  ): Promise<FindManyLessonsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const query = queryParams.toString();
    return api.get<FindManyLessonsResponse>(
      `/courses/${courseId}/lessons${query ? `?${query}` : ''}`,
    );
  },

  findOne: async (id: number): Promise<FindOneLessonResponse> => {
    return api.get<FindOneLessonResponse>(`/lessons/${id}`);
  },

  update: async (
    id: number,
    lessonData: Partial<{
      title: string;
      content: string;
      order: number;
    }>,
  ): Promise<UpdateLessonResponse> => {
    return api.patch<UpdateLessonResponse>(`/lessons/${id}`, lessonData);
  },

  delete: async (id: number): Promise<DeleteLessonResponse> => {
    return api.delete<DeleteLessonResponse>(`/lessons/${id}`);
  },
};

