import { api } from '../utils/api';
import type {
  CreateEnrollmentResponse,
  FindManyEnrollmentsResponse,
  FindOneEnrollmentResponse,
  UpdateEnrollmentResponse,
  DeleteEnrollmentResponse,
} from 'skill-stream-backend/shared/types';

export const enrollmentsService = {
  create: async (courseId: number): Promise<CreateEnrollmentResponse> => {
    return api.post<CreateEnrollmentResponse>(
      `/courses/${courseId}/enroll`,
      {},
    );
  },

  findMany: async (): Promise<FindManyEnrollmentsResponse> => {
    return api.get<FindManyEnrollmentsResponse>('/enrollments');
  },

  findOne: async (id: number): Promise<FindOneEnrollmentResponse> => {
    return api.get<FindOneEnrollmentResponse>(`/enrollments/${id}`);
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

  delete: async (id: number): Promise<DeleteEnrollmentResponse> => {
    return api.delete<DeleteEnrollmentResponse>(`/enrollments/${id}`);
  },
};

