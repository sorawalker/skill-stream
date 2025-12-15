import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInResponse, CreateUserResponse } from '../shared/types';
import { Prisma } from '#generated/prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    try {
      return await this.authService.signIn(signInDto.login, signInDto.password);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === 'User not found' ||
          error.message === 'Invalid password'
        ) {
          throw new HttpException(
            {
              message: 'Invalid credentials',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      }

      throw new HttpException(
        {
          message: 'Failed to sign in',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponse> {
    try {
      return await this.authService.signUp(createUserDto);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new HttpException(
              {
                message: 'The user with this email or name already exists',
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
}
