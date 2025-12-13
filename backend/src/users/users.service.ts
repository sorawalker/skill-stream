import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { Prisma, User } from '#generated/prisma/client';
import { FindManyUsersDto } from './dto/find-many-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findMany(findManyUsersDto: FindManyUsersDto) {
    const { page, limit, search, order, sortBy } = findManyUsersDto;

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    try {
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        data: users,
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

  async findById(id: number, auth: boolean = false): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          password: auth,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findByLogin(
    identifier: string,
    auth: boolean = false,
  ): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          password: auth,
        },
        where: {
          OR: [{ email: identifier }, { name: identifier }],
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async remove(id: number): Promise<User> {
    try {
      return await this.prisma.user.delete({
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
