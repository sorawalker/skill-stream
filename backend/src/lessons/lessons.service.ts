import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma, Lesson } from '#generated/prisma/client';
import { FindManyLessonsDto } from './dto/find-many-lessons.dto';

@Injectable()
export class LessonsService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    courseId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    try {
      return await this.prisma.lesson.create({
        data: {
          ...createLessonDto,
          courseId,
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findManyByCourse(
    courseId: number,
    findManyLessonsDto?: FindManyLessonsDto,
  ) {
    const {
      page = 1,
      limit = 100,
      search,
      order = 'asc',
      sortBy = 'order',
    } = findManyLessonsDto || {};

    const skip = (page - 1) * limit;

    const where: Prisma.LessonWhereInput = {
      courseId,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { content: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    try {
      const [lessons, total] = await Promise.all([
        this.prisma.lesson.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
          include: {
            _count: {
              select: {
                quizzes: true,
              },
            },
          },
        }),
        this.prisma.lesson.count({ where }),
      ]);

      return {
        data: lessons,
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

  async findById(id: number): Promise<Lesson | null> {
    try {
      return await this.prisma.lesson.findFirst({
        where: {
          id,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          _count: {
            select: {
              quizzes: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    try {
      return await this.prisma.lesson.update({
        where: {
          id,
        },
        data: updateLessonDto,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async remove(id: number): Promise<Lesson> {
    try {
      return await this.prisma.lesson.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
