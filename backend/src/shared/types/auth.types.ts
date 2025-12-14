import type { SignInDto } from '../../auth/dto/sign-in.dto';
import type { CreateUserDto } from '../../users/dto/create-user.dto';

export interface SignInResult {
  accessToken: string;
}

export type SignInRequest = SignInDto;
export type RegisterRequest = CreateUserDto;

export type SignInResponse = SignInResult;
