import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import type { UserRole } from '../../shared/types/user.types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(['USER', 'SUPPORT', 'MANAGER', 'ADMIN'], {
    message: 'Role must be one of: USER, SUPPORT, MANAGER, ADMIN',
  })
  role?: UserRole;
}
