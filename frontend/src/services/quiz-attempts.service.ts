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

  findMany: async (): Promise<FindManyQuizAttemptsResponse> => {
    return api.get<FindManyQuizAttemptsResponse>('/quiz-attempts');
  },

  findOne: async (id: number): Promise<FindOneQuizAttemptResponse> => {
    return api.get<FindOneQuizAttemptResponse>(`/quiz-attempts/${id}`);
  },

  findManyByQuiz: async (
    quizId: number,
  ): Promise<FindManyQuizAttemptsResponse> => {
    return api.get<FindManyQuizAttemptsResponse>(
      `/quizzes/${quizId}/attempts`,
    );
  },
};

