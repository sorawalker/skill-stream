import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma, Enrollment } from '#generated/prisma/client';
import { FindManyEnrollmentsDto } from './dto/find-many-enrollments.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: number, courseId: number): Promise<Enrollment> {
    try {
      const existing = await this.prisma.enrollment.findFirst({
        where: {
          userId,
          courseId,
        },
      });

      if (existing) {
        throw new Error('User is already enrolled in this course');
      }

      return await this.prisma.enrollment.create({
        data: {
          userId,
          courseId,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findMany(
    userId: number,
    findManyEnrollmentsDto: FindManyEnrollmentsDto,
  ) {
    const { page, limit, search, order, sortBy } = findManyEnrollmentsDto;

    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {
      userId,
      ...(search
        ? {
            course: {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    try {
      const [enrollments, total] = await Promise.all([
        this.prisma.enrollment.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
                _count: {
                  select: {
                    lessons: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.enrollment.count({ where }),
      ]);

      return {
        data: enrollments,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findById(id: number, userId?: number): Promise<Enrollment | null> {
    try {
      const where: Prisma.EnrollmentWhereInput = {
        id,
        ...(userId ? { userId } : {}),
      };

      return await this.prisma.enrollment.findFirst({
        where,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
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
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async update(
    id: number,
    userId: number,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ): Promise<Enrollment> {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!enrollment) {
        throw new Error('Enrollment not found or access denied');
      }

      return await this.prisma.enrollment.update({
        where: {
          id,
        },
        data: updateEnrollmentDto,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              image: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async remove(id: number, userId: number): Promise<Enrollment> {
    try {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!enrollment) {
        throw new Error('Enrollment not found or access denied');
      }

      return await this.prisma.enrollment.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async calculateProgress(userId: number, courseId: number): Promise<number> {
    try {
      const [totalLessons, completedLessons] = await Promise.all([
        this.prisma.lesson.count({
          where: {
            courseId,
          },
        }),
        this.prisma.userProgress.count({
          where: {
            userId,
            completed: true,
            lesson: {
              courseId,
            },
          },
        }),
      ]);

      if (totalLessons === 0) {
        return 0;
      }

      return Math.round((completedLessons / totalLessons) * 100);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
