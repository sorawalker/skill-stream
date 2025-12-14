import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponse } from '../shared/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    return this.authService.signIn(signInDto.login, signInDto.password);
  }
}
