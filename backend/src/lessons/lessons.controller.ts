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
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Prisma, Role } from '#generated/prisma/client';
import { FindManyLessonsDto } from './dto/find-many-lessons.dto';
import {
  CreateLessonResponse,
  DeleteLessonResponse,
  FindManyLessonsResponse,
  FindOneLessonResponse,
  UpdateLessonResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EnrollmentGuard } from '../auth/guards/enrollment.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('courses/:courseId/lessons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<CreateLessonResponse> {
    try {
      return await this.lessonsService.create(courseId, createLessonDto);
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
              'Failed to create lesson',
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
          message: 'Failed to create lesson',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('courses/:courseId/lessons')
  async findManyByCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Query() findManyLessonsDto: FindManyLessonsDto,
  ): Promise<FindManyLessonsResponse> {
    try {
      return await this.lessonsService.findManyByCourse(
        courseId,
        findManyLessonsDto,
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
        'Failed to get lessons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('lessons/:id')
  @UseGuards(JwtAuthGuard, EnrollmentGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FindOneLessonResponse> {
    const lesson = await this.lessonsService.findById(id);

    if (!lesson) {
      throw new HttpException(
        {
          message: 'Lesson does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return lesson;
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<UpdateLessonResponse> {
    try {
      return await this.lessonsService.update(id, updateLessonDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'Lesson does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to update lesson',
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
        'Failed to update lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteLessonResponse> {
    try {
      return await this.lessonsService.remove(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          {
            message: 'Lesson does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to delete lesson',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
