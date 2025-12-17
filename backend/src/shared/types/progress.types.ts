import type { Lesson } from './lesson.types';
import type { User } from './user.types';

export interface UserProgress {
  id: number;
  userId: number;
  lessonId: number;
  completed: boolean;
  progress: number;
  updatedAt: Date | string;
  user?:
    | User
    | {
        id: number;
        name: string;
        email: string;
      };
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
