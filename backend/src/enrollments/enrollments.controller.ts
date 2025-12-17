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
  Request,
  Query,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { FindManyEnrollmentsDto } from './dto/find-many-enrollments.dto';
import { Prisma } from '#generated/prisma/client';
import {
  CreateEnrollmentResponse,
  DeleteEnrollmentResponse,
  FindManyEnrollmentsResponse,
  FindOneEnrollmentResponse,
  UpdateEnrollmentResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { type RequestWithUser } from '../auth/types/jwt-payload.interface';

@Controller()
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('courses/:courseId/enroll')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Request() req: RequestWithUser,
  ): Promise<CreateEnrollmentResponse> {
    try {
      const userId = req.user.userId;

      return await this.enrollmentsService.create(userId, courseId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'User is already enrolled in this course'
      ) {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.CONFLICT,
        );
      }

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
              'Failed to create enrollment',
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
          message: 'Failed to create enrollment',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('enrollments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER', 'USER')
  async findMany(
    @Query() findManyEnrollmentsDto: FindManyEnrollmentsDto,
    @Request() req: RequestWithUser,
  ): Promise<FindManyEnrollmentsResponse> {
    try {
      const userId = req.user.userId;

      const user = await this.usersService.findById(userId);
      const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';

      return await this.enrollmentsService.findMany(
        isAdmin ? undefined : userId,
        findManyEnrollmentsDto,
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
        'Failed to get enrollments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('enrollments/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<FindOneEnrollmentResponse> {
    const userId = req.user.userId;
    const enrollment = await this.enrollmentsService.findById(id, userId);

    if (!enrollment) {
      throw new HttpException(
        {
          message: 'Enrollment does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollment;
  }

  @Patch('enrollments/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
    @Request() req: RequestWithUser,
  ): Promise<UpdateEnrollmentResponse> {
    try {
      const userId = req.user.userId;

      return await this.enrollmentsService.update(
        id,
        userId,
        updateEnrollmentDto,
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Enrollment not found or access denied'
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
                message: 'Enrollment does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          default:
            throw new HttpException(
              'Failed to update enrollment',
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
        'Failed to update enrollment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('enrollments/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ): Promise<DeleteEnrollmentResponse> {
    try {
      const userId = req.user.userId;

      return await this.enrollmentsService.remove(id, userId);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Enrollment not found or access denied'
      ) {
        throw new HttpException(
          {
            message: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          {
            message: 'Enrollment does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to delete enrollment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
