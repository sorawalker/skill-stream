export interface QuizQuestion {
  question: string;
  rightAnswer: string;
  variants: string[];
}

export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
  questions: QuizQuestion[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
