import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma, Course } from '#generated/prisma/client';
import { FindManyCoursesDto } from './dto/find-many-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      return await this.prisma.course.create({
        data: createCourseDto,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findMany(findManyCoursesDto: FindManyCoursesDto) {
    const { page, limit, search, order, sortBy } = findManyCoursesDto;

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    try {
      const [courses, total] = await Promise.all([
        this.prisma.course.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
          include: {
            _count: {
              select: {
                lessons: true,
                enrollments: true,
              },
            },
          },
        }),
        this.prisma.course.count({ where }),
      ]);

      return {
        data: courses,
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

  async findById(id: number): Promise<Course | null> {
    try {
      return await this.prisma.course.findFirst({
        where: {
          id,
        },
        include: {
          lessons: {
            orderBy: {
              order: 'asc',
            },
            include: {
              _count: {
                select: {
                  quizzes: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      return await this.prisma.course.update({
        where: {
          id,
        },
        data: updateCourseDto,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async remove(id: number): Promise<Course> {
    try {
      return await this.prisma.course.delete({
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
