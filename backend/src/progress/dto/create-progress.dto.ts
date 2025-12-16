import { IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateProgressDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;
}
