import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma } from '#generated/prisma/client';
import { Quiz, QuizQuestion } from '../shared/types/quiz.types';

interface QuizWithoutAnswers {
  id: number;
  lessonId: number;
  title: string;
  questions: Array<Omit<QuizQuestion, 'rightAnswer'>>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

@Injectable()
export class QuizzesService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(lessonId: number, createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const questionsPlain: Prisma.InputJsonValue = createQuizDto.questions.map(
        (q) => ({
          question: q.question,
          rightAnswer: q.rightAnswer,
          variants: q.variants,
        }),
      );

      const quiz = await this.prisma.quiz.create({
        data: {
          lessonId,
          title: createQuizDto.title,
          questions: questionsPlain,
        },
      });

      return this.mapPrismaQuizToQuiz(quiz);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findManyByLesson(lessonId: number): Promise<Quiz[]> {
    try {
      const quizzes = await this.prisma.quiz.findMany({
        where: {
          lessonId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return quizzes.map((quiz) => this.mapPrismaQuizToQuiz(quiz));
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findById(
    id: number,
    includeAnswers: boolean = false,
  ): Promise<Quiz | QuizWithoutAnswers | null> {
    try {
      const quiz = await this.prisma.quiz.findFirst({
        where: {
          id,
        },
      });

      if (!quiz) {
        return null;
      }

      const mappedQuiz = this.mapPrismaQuizToQuiz(quiz);

      if (!includeAnswers) {
        const questionsWithoutAnswers = this.removeAnswersFromQuestions(
          mappedQuiz.questions,
        );

        const quizWithoutAnswers: QuizWithoutAnswers = {
          id: mappedQuiz.id,
          lessonId: mappedQuiz.lessonId,
          title: mappedQuiz.title,
          questions: questionsWithoutAnswers,
          createdAt: mappedQuiz.createdAt,
          updatedAt: mappedQuiz.updatedAt,
        };

        return quizWithoutAnswers;
      }

      return mappedQuiz;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    try {
      const updateData: Prisma.QuizUpdateInput = {};

      if (updateQuizDto.title !== undefined) {
        updateData.title = updateQuizDto.title;
      }

      if (updateQuizDto.questions !== undefined) {
        const questionsPlain: Prisma.InputJsonValue =
          updateQuizDto.questions.map((q) => ({
            question: q.question,
            rightAnswer: q.rightAnswer,
            variants: q.variants,
          }));
        updateData.questions = questionsPlain;
      }

      const quiz = await this.prisma.quiz.update({
        where: {
          id,
        },
        data: updateData,
      });

      return this.mapPrismaQuizToQuiz(quiz);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async remove(id: number): Promise<Quiz> {
    try {
      const quiz = await this.prisma.quiz.delete({
        where: {
          id,
        },
      });

      return this.mapPrismaQuizToQuiz(quiz);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private mapPrismaQuizToQuiz(prismaQuiz: {
    id: number;
    lessonId: number;
    title: string;
    questions: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }): Quiz {
    let questions: QuizQuestion[] = [];

    if (Array.isArray(prismaQuiz.questions)) {
      const questionsArray = prismaQuiz.questions as unknown[];
      questions = questionsArray.filter((item): item is QuizQuestion => {
        if (typeof item !== 'object' || item === null) {
          return false;
        }

        const question = item as Record<string, unknown>;

        return (
          typeof question.question === 'string' &&
          typeof question.rightAnswer === 'string' &&
          Array.isArray(question.variants) &&
          question.variants.every((v) => typeof v === 'string')
        );
      });
    }

    return {
      id: prismaQuiz.id,
      lessonId: prismaQuiz.lessonId,
      title: prismaQuiz.title,
      questions,
      createdAt: prismaQuiz.createdAt,
      updatedAt: prismaQuiz.updatedAt,
    };
  }

  private removeAnswersFromQuestions(
    questions: QuizQuestion[],
  ): Array<Omit<QuizQuestion, 'rightAnswer'>> {
    return questions.map((question) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { rightAnswer, ...questionWithoutAnswer } = question;
      return questionWithoutAnswer;
    });
  }
}
