export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    quizzes?: number;
  };
}
