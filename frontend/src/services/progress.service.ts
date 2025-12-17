import { api } from '../utils/api';
import type {
  CreateProgressResponse,
  FindManyProgressResponse,
  FindOneProgressResponse,
  UpdateProgressResponse,
} from 'skill-stream-backend/shared/types';

export const progressService = {
  create: async (
    lessonId: number,
    progressData: {
      completed: boolean;
      progress: number;
    },
  ): Promise<CreateProgressResponse> => {
    return api.post<CreateProgressResponse>(
      `/lessons/${lessonId}/progress`,
      progressData,
    );
  },

  findMany: async (): Promise<FindManyProgressResponse> => {
    return api.get<FindManyProgressResponse>('/progress');
  },

  findByLesson: async (
    lessonId: number,
  ): Promise<FindOneProgressResponse> => {
    return api.get<FindOneProgressResponse>(`/progress/lesson/${lessonId}`);
  },

  findByCourse: async (
    courseId: number,
  ): Promise<FindManyProgressResponse> => {
    return api.get<FindManyProgressResponse>(`/progress/course/${courseId}`);
  },

  update: async (
    id: number,
    progressData: Partial<{
      completed: boolean;
      progress: number;
    }>,
  ): Promise<UpdateProgressResponse> => {
    return api.patch<UpdateProgressResponse>(`/progress/${id}`, progressData);
  },
};

