import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma, UserProgress } from '#generated/prisma/client';

@Injectable()
export class ProgressService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    userId: number,
    lessonId: number,
    createProgressDto: CreateProgressDto,
  ): Promise<UserProgress> {
    try {
      const progress = await this.prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          ...createProgressDto,
        },
        create: {
          userId,
          lessonId,
          completed: createProgressDto.completed ?? false,
          progress: createProgressDto.progress ?? 0,
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,
            },
          },
        },
      });

      if (progress.completed && progress.lesson) {
        const courseId = (progress.lesson as { courseId: number }).courseId;
        await this.updateEnrollmentProgress(userId, courseId);
      }

      return progress;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findMany(userId?: number) {
    try {
      const progressList = await this.prisma.userProgress.findMany({
        where: userId ? { userId } : undefined,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      return {
        data: progressList,
        meta: {
          total: progressList.length,
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findByLesson(userId: number, lessonId: number) {
    try {
      return await this.prisma.userProgress.findFirst({
        where: {
          userId,
          lessonId,
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findByCourse(userId: number, courseId: number) {
    try {
      const progressList = await this.prisma.userProgress.findMany({
        where: {
          userId,
          lesson: {
            courseId,
          },
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              order: true,
            },
          },
        },
        orderBy: {
          lesson: {
            order: 'asc',
          },
        },
      });

      return {
        data: progressList,
        meta: {
          total: progressList.length,
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findById(id: number, userId?: number): Promise<UserProgress | null> {
    try {
      const where: Prisma.UserProgressWhereInput = {
        id,
        ...(userId ? { userId } : {}),
      };

      return await this.prisma.userProgress.findFirst({
        where,
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,
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
    updateProgressDto: UpdateProgressDto,
  ): Promise<UserProgress> {
    try {
      const progress = await this.prisma.userProgress.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          lesson: {
            select: {
              courseId: true,
            },
          },
        },
      });

      if (!progress) {
        throw new Error('Progress not found or access denied');
      }

      const finalProgress = updateProgressDto.progress
        ? Math.min(updateProgressDto.progress, 100)
        : progress.progress;

      const updated = await this.prisma.userProgress.update({
        where: {
          id,
        },
        data: {
          ...updateProgressDto,
          progress: finalProgress,
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true,
            },
          },
        },
      });

      if (updated.completed && updated.lesson) {
        const courseId = (updated.lesson as { courseId: number }).courseId;
        await this.updateEnrollmentProgress(userId, courseId);
      }

      return updated;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  private async updateEnrollmentProgress(
    userId: number,
    courseId: number,
  ): Promise<void> {
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

      const enrollmentProgress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      const isCompleted = completedLessons === totalLessons && totalLessons > 0;

      await this.prisma.enrollment.updateMany({
        where: {
          userId,
          courseId,
        },
        data: {
          progress: enrollmentProgress,
          completed: isCompleted,
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
