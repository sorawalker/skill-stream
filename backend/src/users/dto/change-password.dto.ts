import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword: string;
}
