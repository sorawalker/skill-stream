import type { User } from './user.types';
import type { Course } from './course.types';

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: Date | string;
  completed: boolean;
  progress: number;
  user?:
    | User
    | {
        id: number;
        name: string;
        email: string;
      };
  course?:
    | Course
    | {
        id: number;
        title: string;
        description: string;
        image: string;
        createdAt?: Date | string;
        updatedAt?: Date | string;
        _count?: {
          lessons?: number;
        };
      };
}
