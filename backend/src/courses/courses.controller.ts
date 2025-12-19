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
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Prisma, Role } from '#generated/prisma/client';
import { FindManyCoursesDto } from './dto/find-many-courses.dto';
import {
  CreateCourseResponse,
  DeleteCourseResponse,
  FindManyCoursesResponse,
  FindOneCourseResponse,
  UpdateCourseResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<CreateCourseResponse> {
    try {
      return await this.coursesService.create(createCourseDto);
    } catch (error) {
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
          message: 'Failed to create course',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findMany(
    @Query() findManyCoursesDto: FindManyCoursesDto,
  ): Promise<FindManyCoursesResponse> {
    try {
      return await this.coursesService.findMany(findManyCoursesDto);
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
        'Failed to get courses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<FindOneCourseResponse> {
    const course = await this.coursesService.findById(id);

    if (!course) {
      throw new HttpException(
        {
          message: 'Course does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return course;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async update(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<UpdateCourseResponse> {
    try {
      return await this.coursesService.update(id, updateCourseDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'Course does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to update course',
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
        'Failed to update course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  async remove(@Param('id') id: number): Promise<DeleteCourseResponse> {
    try {
      return await this.coursesService.remove(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          {
            message: 'Course does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to delete course',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
