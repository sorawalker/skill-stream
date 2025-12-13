import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../repositories/prisma/prisma.service';
import { User } from '#generated/prisma/client';

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

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id,
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
