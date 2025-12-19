import { api } from '../utils/api';
import type {
  CreateQuizAttemptResponse,
  FindManyQuizAttemptsResponse,
  FindOneQuizAttemptResponse,
} from 'skill-stream-backend/shared/types';

export const quizAttemptsService = {
  create: async (
    quizId: number,
    attemptData: {
      answers: Array<{
        question: string;
        answer: string;
      }>;
    },
  ): Promise<CreateQuizAttemptResponse> => {
    return api.post<CreateQuizAttemptResponse>(
      `/quizzes/${quizId}/attempt`,
      attemptData,
    );
  },

  findMany: async (params?: {
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
    sortBy?: string;
  }): Promise<FindManyQuizAttemptsResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page)
      queryParams.append('page', params.page.toString());
    if (params?.limit)
      queryParams.append('limit', params.limit.toString());
    if (params?.sortBy)
      queryParams.append('sortBy', params.sortBy);
    if (params?.order)
      queryParams.append('order', params.order);

    const query = queryParams.toString();
    return api.get<FindManyQuizAttemptsResponse>(
      `/quiz-attempts${query ? `?${query}` : ''}`,
    );
  },

  findOne: async (
    id: number,
  ): Promise<FindOneQuizAttemptResponse> => {
    return api.get<FindOneQuizAttemptResponse>(
      `/quiz-attempts/${id}`,
    );
  },

  findManyByQuiz: async (
    quizId: number,
  ): Promise<FindManyQuizAttemptsResponse> => {
    return api.get<FindManyQuizAttemptsResponse>(
      `/quizzes/${quizId}/attempts`,
    );
  },

  findUserAttempt: async (
    quizId: number,
  ): Promise<CreateQuizAttemptResponse> => {
    return api.get<CreateQuizAttemptResponse>(
      `/quizzes/${quizId}/user-attempt`,
    );
  },
};
