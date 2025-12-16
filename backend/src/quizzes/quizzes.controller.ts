import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Prisma } from '#generated/prisma/client';
import {
  CreateQuizResponse,
  FindManyQuizzesResponse,
  FindOneQuizResponse,
  UpdateQuizResponse,
  DeleteQuizResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('lessons/:lessonId/quizzes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<CreateQuizResponse> {
    try {
      return await this.quizzesService.create(lessonId, createQuizDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new HttpException(
              {
                message: 'Lesson does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to create quiz',
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
          message: 'Failed to create quiz',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('lessons/:lessonId/quizzes')
  async findManyByLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
  ): Promise<FindManyQuizzesResponse> {
    try {
      const quizzes = await this.quizzesService.findManyByLesson(lessonId);

      return {
        data: quizzes,
        meta: {
          total: quizzes.length,
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

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new HttpException(
              {
                message: 'Lesson does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              {
                message: 'Failed to get quizzes',
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }

      throw new HttpException(
        {
          message: 'Failed to get quizzes',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('quizzes/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeAnswers') includeAnswers?: string,
  ): Promise<FindOneQuizResponse> {
    const includeAnswersBool: boolean =
      includeAnswers === 'true' || includeAnswers === '1';

    const quiz = await this.quizzesService.findById(id, includeAnswersBool);

    if (!quiz) {
      throw new HttpException(
        {
          message: 'Quiz does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quiz;
  }

  @Patch('quizzes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<UpdateQuizResponse> {
    try {
      return await this.quizzesService.update(id, updateQuizDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'Quiz does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to update quiz',
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
        'Failed to update quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('quizzes/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteQuizResponse> {
    try {
      return await this.quizzesService.remove(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          {
            message: 'Quiz does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to delete quiz',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
