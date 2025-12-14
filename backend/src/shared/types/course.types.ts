import type { Lesson } from './lesson.types';

export interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  lessons?: Lesson[];
  _count?: {
    lessons?: number;
    enrollments?: number;
  };
}
