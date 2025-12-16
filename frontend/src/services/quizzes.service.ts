import { api } from '../utils/api';
import type {
  Quiz,
  CreateQuizResponse,
  FindManyQuizzesResponse,
  FindOneQuizResponse,
  UpdateQuizResponse,
  DeleteQuizResponse,
} from 'skill-stream-backend/shared/types';

export const quizzesService = {
  create: async (
    lessonId: number,
    quizData: {
      title: string;
      questions: Array<{
        question: string;
        rightAnswer: string;
        variants: string[];
      }>;
    },
  ): Promise<CreateQuizResponse> => {
    return api.post<CreateQuizResponse>(
      `/lessons/${lessonId}/quizzes`,
      quizData,
    );
  },

  findManyByLesson: async (
    lessonId: number,
  ): Promise<FindManyQuizzesResponse> => {
    return api.get<FindManyQuizzesResponse>(
      `/lessons/${lessonId}/quizzes`,
    );
  },

  findOne: async (
    id: number,
    includeAnswers?: boolean,
  ): Promise<FindOneQuizResponse> => {
    const query = includeAnswers ? '?includeAnswers=true' : '';
    return api.get<FindOneQuizResponse>(`/quizzes/${id}${query}`);
  },

  update: async (
    id: number,
    quizData: Partial<{
      title: string;
      questions: Array<{
        question: string;
        rightAnswer: string;
        variants: string[];
      }>;
    }>,
  ): Promise<UpdateQuizResponse> => {
    return api.patch<UpdateQuizResponse>(`/quizzes/${id}`, quizData);
  },

  delete: async (id: number): Promise<DeleteQuizResponse> => {
    return api.delete<DeleteQuizResponse>(`/quizzes/${id}`);
  },
};

