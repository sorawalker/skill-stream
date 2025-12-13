import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(
    login: string, // email or name
    pass: string,
  ) {
    const user = await this.usersService.findByLogin(login, true);

    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(pass, user.password);
    if (!isValid) throw new Error('Invalid password');

    const payload = { sub: user.id, username: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
