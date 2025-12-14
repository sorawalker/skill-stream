import type { SignInDto } from '../../auth/dto/sign-in.dto';
import type { CreateUserDto } from '../../users/dto/create-user.dto';

export type SignInRequest = SignInDto;
export type RegisterRequest = CreateUserDto;

export interface SignInResponse {
  accessToken: string;
}
