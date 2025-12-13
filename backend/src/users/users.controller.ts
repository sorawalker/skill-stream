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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '#generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { FindManyUsersDto } from './dto/find-many-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      return await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new HttpException(
              {
                message: 'The user with this email already exists',
              },
              HttpStatus.CONFLICT,
            );

          default:
            throw new HttpException(
              'Failed to create user',
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
          message: 'Failed to create user',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findMany(@Query() findManyUsersDto: FindManyUsersDto) {
    try {
      return await this.usersService.findMany(findManyUsersDto);
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
        'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new HttpException(
        {
          message: 'User does not exist',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException(
              {
                message: 'User does not exist',
              },
              HttpStatus.NOT_FOUND,
            );

          case 'P2002':
            throw new HttpException(
              {
                message: 'The user with this email already exists',
              },
              HttpStatus.CONFLICT,
            );

          default:
            throw new HttpException(
              'Failed to update user',
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
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException(
          {
            message: 'User does not exist',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
