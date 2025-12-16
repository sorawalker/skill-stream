import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { QuizAttemptsService } from './quiz-attempts.service';
import { CreateQuizAttemptDto } from './dto/create-quiz-attempt.dto';
import { Prisma } from '#generated/prisma/client';
import {
  CreateQuizAttemptResponse,
  FindManyQuizAttemptsResponse,
  FindOneQuizAttemptResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { type RequestWithUser } from '../auth/types/jwt-payload.interface';

@Controller()
export class QuizAttemptsController {
  constructor(private readonly quizAttemptsService: QuizAttemptsService) {}

  @Post('quizzes/:quizId/attempt')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('quizId', ParseIntPipe) quizId: number,
    @Body() createQuizAttemptDto: CreateQuizAttemptDto,
    @Request() req: RequestWithUser,
  ): Promise<CreateQuizAttemptResponse> {
    try {
      const userId = req.user.userId;
      return await this.quizAttemptsService.create(
        userId,
        quizId,
        createQuizAttemptDto,
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'Quiz does not exist') {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new HttpException(
              {
                message: 'Quiz or user does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              {
                message: 'Failed to create quiz attempt',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          {
            message: 'Incorrect data type',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          message: 'Failed to create quiz attempt',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('quiz-attempts')
  @UseGuards(JwtAuthGuard)
  async findManyByUser(
    @Request() req: RequestWithUser,
  ): Promise<FindManyQuizAttemptsResponse> {
    try {
      const userId = req.user.userId;
      const attempts = await this.quizAttemptsService.findManyByUser(userId);

      return {
        data: attempts,
        meta: {
          total: attempts.length,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          {
            message: 'Bad query params',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          message: 'Failed to get quiz attempts',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('quiz-attempts/:id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOneQuizAttemptResponse> {
    try {
      const attempt = await this.quizAttemptsService.findById(id);

      if (!attempt) {
        throw new HttpException(
          {
            message: 'Quiz attempt does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return attempt;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'Quiz attempt does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              {
                message: 'Failed to get quiz attempt',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      throw new HttpException(
        {
          message: 'Failed to get quiz attempt',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('quizzes/:quizId/attempts')
  @UseGuards(JwtAuthGuard)
  async findManyByQuiz(
    @Param('quizId', ParseIntPipe) quizId: number,
  ): Promise<FindManyQuizAttemptsResponse> {
    try {
      const attempts = await this.quizAttemptsService.findManyByQuiz(quizId);

      return {
        data: attempts,
        meta: {
          total: attempts.length,
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new HttpException(
              {
                message: 'Quiz does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              {
                message: 'Failed to get quiz attempts',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new HttpException(
          {
            message: 'Bad query params',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        {
          message: 'Failed to get quiz attempts',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
