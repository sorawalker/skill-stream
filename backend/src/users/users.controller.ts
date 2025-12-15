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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '#generated/prisma/client';
import { FindManyUsersDto } from './dto/find-many-user.dto';
import {
  CreateUserResponse,
  DeleteUserResponse,
  FindManyUsersResponse,
  FindOneUserResponse,
  UpdateUserResponse,
} from '../shared/types';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    try {
      return await this.usersService.create(createUserDto);
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findMany(
    @Query() findManyUsersDto: FindManyUsersDto,
  ): Promise<FindManyUsersResponse> {
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

  @Get(':identifier')
  async findOne(
    @Param('identifier') identifier: string,
  ): Promise<FindOneUserResponse> {
    let user: User | null;

    const parsedId = parseInt(identifier, 10);

    if (!isNaN(parsedId)) {
      user = await this.usersService.findById(parsedId);
    } else {
      user = await this.usersService.findByLogin(identifier);
    }

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponse> {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: number): Promise<DeleteUserResponse> {
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
