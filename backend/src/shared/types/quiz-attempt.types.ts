export interface QuizAttemptAnswer {
  question: string;
  answer: string;
}

export interface QuizAttempt {
  id: number;
  userId: number;
  quizId: number;
  score: number;
  answers: QuizAttemptAnswer[];
  attemptedAt: Date | string;
}

export interface QuizAttemptWithDetails extends QuizAttempt {
  quiz?: {
    id: number;
    title: string;
    lessonId: number;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface QuizAttemptResult {
  attempt: QuizAttempt;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  correctAnswersList: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}
