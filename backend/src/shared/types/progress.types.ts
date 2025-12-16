import type { Lesson } from './lesson.types';

export interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  progress: number;
  updatedAt: Date | string;
  lesson?:
    | Lesson
    | {
        id: number;
        title: string;
        courseId: number;
        course?: {
          id: number;
          title: string;
        };
      }
    | {
        id: number;
        title: string;
        order: number;
      };
}
