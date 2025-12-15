import { IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;
}
