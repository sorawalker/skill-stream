import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Request,
  Query,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { FindManyProgressDto } from './dto/find-many-progress.dto';
import { Prisma } from '#generated/prisma/client';
import {
  CreateProgressResponse,
  FindManyProgressResponse,
  FindOneProgressResponse,
  UpdateProgressResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { type RequestWithUser } from '../auth/types/jwt-payload.interface';

@Controller()
export class ProgressController {
  constructor(
    private readonly progressService: ProgressService,
    private readonly usersService: UsersService,
  ) {}

  @Post('lessons/:lessonId/progress')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() createProgressDto: CreateProgressDto,
    @Request() req: RequestWithUser,
  ): Promise<CreateProgressResponse> {
    try {
      const userId = req.user.userId;
      return await this.progressService.create(
        userId,
        lessonId,
        createProgressDto,
      );
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
              'Failed to create progress',
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
          message: 'Failed to create progress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'USER')
  async findMany(
    @Query() findManyProgressDto: FindManyProgressDto,
    @Request() req: RequestWithUser,
  ): Promise<FindManyProgressResponse> {
    try {
      const userId = req.user.userId;

      const user = await this.usersService.findById(userId);
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

      return await this.progressService.findMany(
        isAdmin ? undefined : userId,
        findManyProgressDto,
      );
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
          message: 'Failed to get progress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('progress/lesson/:lessonId')
  @UseGuards(JwtAuthGuard)
  async findByLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Request() req: RequestWithUser,
  ): Promise<FindOneProgressResponse | null> {
    try {
      const userId = req.user.userId;
      return await this.progressService.findByLesson(userId, lessonId);
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
              {
                message: 'Failed to get progress',
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
          message: 'Failed to get progress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('progress/course/:courseId')
  @UseGuards(JwtAuthGuard)
  async findByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Request() req: RequestWithUser,
  ): Promise<FindManyProgressResponse> {
    try {
      const userId = req.user.userId;
      return await this.progressService.findByCourse(userId, courseId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2003':
            throw new HttpException(
              {
                message: 'Course does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              {
                message: 'Failed to get progress',
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
          message: 'Failed to get progress',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('progress/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgressDto: UpdateProgressDto,
    @Request() req: RequestWithUser,
  ): Promise<UpdateProgressResponse> {
    try {
      const userId = req.user.userId;
      return await this.progressService.update(id, userId, updateProgressDto);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Progress not found or access denied'
      ) {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'Progress does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to update progress',
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
        'Failed to update progress',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
