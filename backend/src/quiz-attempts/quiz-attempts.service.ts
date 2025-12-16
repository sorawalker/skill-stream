import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma } from '#generated/prisma/client';
import {
  QuizAttempt,
  QuizAttemptAnswer,
  QuizAttemptWithDetails,
  QuizAttemptResult,
} from '../shared/types/quiz-attempt.types';
import { Quiz, QuizQuestion } from '../shared/types/quiz.types';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class QuizAttemptsService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
    private readonly quizzesService: QuizzesService,
  ) {}

  async create(
    userId: number,
    quizId: number,
    createQuizAttemptDto: CreateQuizAttemptDto,
  ): Promise<QuizAttemptResult> {
    try {
      const quizResult = await this.quizzesService.findById(quizId, true);

      if (!quizResult) {
        throw new Error('Quiz does not exist');
      }

      const isFullQuiz = this.isQuizWithAnswers(quizResult);
      if (!isFullQuiz) {
        throw new Error('Quiz answers are required for scoring');
      }

      const quiz: Quiz = quizResult;

      const score = this.calculateScore(
        quiz.questions,
        createQuizAttemptDto.answers,
      );

      const answersJson: Prisma.InputJsonValue =
        createQuizAttemptDto.answers.map((a) => ({
          question: a.question,
          answer: a.answer,
        }));

      const attempt = await this.prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score,
          answer: answersJson,
        },
      });

      const mappedAttempt = this.mapPrismaAttemptToAttempt(attempt);

      const result = this.buildAttemptResult(
        mappedAttempt,
        quiz.questions,
        createQuizAttemptDto.answers,
      );

      return result;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findManyByUser(userId: number): Promise<QuizAttemptWithDetails[]> {
    try {
      const attempts = await this.prisma.quizAttempt.findMany({
        where: {
          userId,
        },
        orderBy: {
          attemptedAt: 'desc',
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              lessonId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return attempts.map((attempt) =>
        this.mapPrismaAttemptToAttemptWithDetails(attempt),
      );
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findById(id: number): Promise<QuizAttemptWithDetails | null> {
    try {
      const attempt = await this.prisma.quizAttempt.findFirst({
        where: {
          id,
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              lessonId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!attempt) {
        return null;
      }

      return this.mapPrismaAttemptToAttemptWithDetails(attempt);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findManyByQuiz(quizId: number): Promise<QuizAttemptWithDetails[]> {
    try {
      const attempts = await this.prisma.quizAttempt.findMany({
        where: {
          quizId,
        },
        orderBy: {
          attemptedAt: 'desc',
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              lessonId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return attempts.map((attempt) =>
        this.mapPrismaAttemptToAttemptWithDetails(attempt),
      );
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findAttemptByUserAndQuiz(
    userId: number,
    quizId: number,
  ): Promise<QuizAttemptWithDetails | null> {
    try {
      const attempt = await this.prisma.quizAttempt.findFirst({
        where: {
          userId,
          quizId,
        },
        orderBy: {
          attemptedAt: 'desc',
        },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
              lessonId: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!attempt) {
        return null;
      }

      return this.mapPrismaAttemptToAttemptWithDetails(attempt);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async getAttemptResult(
    userId: number,
    quizId: number,
  ): Promise<QuizAttemptResult | null> {
    try {
      const attempt = await this.findAttemptByUserAndQuiz(userId, quizId);

      if (!attempt) {
        return null;
      }

      const quizResult = await this.quizzesService.findById(quizId, true);

      if (!quizResult) {
        throw new Error('Quiz does not exist');
      }

      const isFullQuiz = this.isQuizWithAnswers(quizResult);
      if (!isFullQuiz) {
        throw new Error('Quiz answers are required');
      }

      const quiz: Quiz = quizResult;
      const mappedAttempt = this.mapPrismaAttemptToAttempt({
        id: attempt.id,
        userId: attempt.userId,
        quizId: attempt.quizId,
        score: attempt.score,
        answer: attempt.answers as unknown as Prisma.JsonValue,
        attemptedAt: new Date(attempt.attemptedAt),
      });

      return this.buildAttemptResult(
        mappedAttempt,
        quiz.questions,
        attempt.answers,
      );
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private calculateScore(
    questions: QuizQuestion[],
    answers: QuizAttemptAnswer[],
  ): number {
    if (questions.length === 0) {
      return 0;
    }

    let correctCount = 0;

    for (const question of questions) {
      const userAnswer = answers.find((a) => a.question === question.question);

      if (userAnswer && userAnswer.answer === question.rightAnswer) {
        correctCount++;
      }
    }

    return (correctCount / questions.length) * 100;
  }

  private buildAttemptResult(
    attempt: QuizAttempt,
    questions: QuizQuestion[],
    userAnswers: QuizAttemptAnswer[],
  ): QuizAttemptResult {
    const correctAnswersList: Array<{
      question: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }> = [];

    for (const question of questions) {
      const userAnswer = userAnswers.find(
        (a) => a.question === question.question,
      );

      const userAnswerText = userAnswer ? userAnswer.answer : '';
      const isCorrect = userAnswerText === question.rightAnswer;

      correctAnswersList.push({
        question: question.question,
        userAnswer: userAnswerText,
        correctAnswer: question.rightAnswer,
        isCorrect,
      });
    }

    const correctAnswers = correctAnswersList.filter((a) => a.isCorrect).length;
    const incorrectAnswers = correctAnswersList.length - correctAnswers;

    return {
      attempt,
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      correctAnswersList,
    };
  }

  private mapPrismaAttemptToAttempt(prismaAttempt: {
    id: number;
    userId: number;
    quizId: number;
    score: number;
    answer: Prisma.JsonValue;
    attemptedAt: Date;
  }): QuizAttempt {
    let answers: QuizAttemptAnswer[] = [];

    if (Array.isArray(prismaAttempt.answer)) {
      const answersArray = prismaAttempt.answer as unknown[];
      answers = answersArray.filter((item): item is QuizAttemptAnswer => {
        if (typeof item !== 'object' || item === null) {
          return false;
        }

        const answer = item as Record<string, unknown>;

        return (
          typeof answer.question === 'string' &&
          typeof answer.answer === 'string'
        );
      });
    }

    return {
      id: prismaAttempt.id,
      userId: prismaAttempt.userId,
      quizId: prismaAttempt.quizId,
      score: prismaAttempt.score,
      answers,
      attemptedAt: prismaAttempt.attemptedAt,
    };
  }

  private mapPrismaAttemptToAttemptWithDetails(prismaAttempt: {
    id: number;
    userId: number;
    quizId: number;
    score: number;
    answer: Prisma.JsonValue;
    attemptedAt: Date;
    quiz: {
      id: number;
      title: string;
      lessonId: number;
    } | null;
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  }): QuizAttemptWithDetails {
    const baseAttempt = this.mapPrismaAttemptToAttempt(prismaAttempt);

    const attemptWithDetails: QuizAttemptWithDetails = {
      ...baseAttempt,
    };

    if (prismaAttempt.quiz) {
      attemptWithDetails.quiz = {
        id: prismaAttempt.quiz.id,
        title: prismaAttempt.quiz.title,
        lessonId: prismaAttempt.quiz.lessonId,
      };
    }

    if (prismaAttempt.user) {
      attemptWithDetails.user = {
        id: prismaAttempt.user.id,
        name: prismaAttempt.user.name,
        email: prismaAttempt.user.email,
      };
    }

    return attemptWithDetails;
  }

  private isQuizWithAnswers(
    quiz: Quiz | { questions: Array<Omit<QuizQuestion, 'rightAnswer'>> },
  ): quiz is Quiz {
    if (quiz.questions.length === 0) {
      return true;
    }

    const firstQuestion = quiz.questions[0];
    return 'rightAnswer' in firstQuestion;
  }
}
