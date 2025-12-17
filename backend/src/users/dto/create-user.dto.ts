import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { UserRole } from '../../shared/types/user.types';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  name: string;

  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'The password must contain at least 8 characters, including uppercase letter, lowercase letter, number and special character.',
    },
  )
  @MaxLength(32)
  password: string;

  @IsOptional()
  @IsEnum(['USER', 'SUPPORT', 'MANAGER', 'ADMIN'], {
    message: 'Role must be one of: USER, SUPPORT, MANAGER, ADMIN',
  })
  role?: UserRole;
}
