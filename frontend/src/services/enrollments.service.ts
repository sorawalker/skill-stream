import { api } from '../utils/api';
import type {
  CreateEnrollmentResponse,
  FindManyEnrollmentsResponse,
  FindOneEnrollmentResponse,
  UpdateEnrollmentResponse,
  DeleteEnrollmentResponse,
} from 'skill-stream-backend/shared/types';

export const enrollmentsService = {
  create: async (
    courseId: number,
  ): Promise<CreateEnrollmentResponse> => {
    return api.post<CreateEnrollmentResponse>(
      `/courses/${courseId}/enroll`,
      {},
    );
  },

  findMany: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    order?: 'asc' | 'desc';
    sortBy?: string;
    all?: boolean;
  }): Promise<FindManyEnrollmentsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page)
      queryParams.append('page', params.page.toString());
    if (params?.limit)
      queryParams.append('limit', params.limit.toString());
    if (params?.search)
      queryParams.append('search', params.search);
    if (params?.sortBy)
      queryParams.append('sortBy', params.sortBy);
    if (params?.order)
      queryParams.append('order', params.order);
    if (params?.all) queryParams.append('all', 'true');

    const query = queryParams.toString();
    return api.get<FindManyEnrollmentsResponse>(
      `/enrollments${query ? `?${query}` : ''}`,
    );
  },

  findOne: async (
    id: number,
  ): Promise<FindOneEnrollmentResponse> => {
    return api.get<FindOneEnrollmentResponse>(
      `/enrollments/${id}`,
    );
  },

  update: async (
    id: number,
    enrollmentData: Partial<{
      completed: boolean;
      progress: number;
    }>,
  ): Promise<UpdateEnrollmentResponse> => {
    return api.patch<UpdateEnrollmentResponse>(
      `/enrollments/${id}`,
      enrollmentData,
    );
  },

  delete: async (
    id: number,
  ): Promise<DeleteEnrollmentResponse> => {
    return api.delete<DeleteEnrollmentResponse>(
      `/enrollments/${id}`,
    );
  },
};
